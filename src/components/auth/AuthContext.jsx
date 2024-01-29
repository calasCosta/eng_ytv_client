import React, {createContext, useContext,  useState, useEffect} from "react";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from "react-toastify";


const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState(localStorage.getItem('profile') ?
                                                JSON.parse(localStorage.getItem('profile')) : {} );

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse) ,
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                                        
                    axios
                      .post(process.env.REACT_APP_BACKEND_LOCALHOST + "/auth/signIn", {
                        profile: res.data
                      })
                      .then((response)=> {
                        setProfile(response.data.userObject);

                        console.log(user.access_token);

                        localStorage.setItem('profile', JSON.stringify(response.data.userObject));
                        
                        if(response.data.message === "Welcome again."){
                            toast.success(response.data.message, {
                                position: toast.POSITION.BOTTOM_LEFT, 
                            });
                        }
                      })
                      .catch(console.error);
                })
                .catch((err) => {console.log(profile); console.log(err)});
        }
    },[user]);


    const logout = () => {
        axios
          .post(process.env.REACT_APP_BACKEND_LOCALHOST + "/auth/signOut", {
            profile: profile
          })
          .then(()=>{
            console.log("User logged out");
            localStorage.clear()    
          })
          .catch(console.error);
  
        googleLogout();
        setProfile({});
    };

    const isLoggedIn = () => {
        return !!Object.keys(profile).length;
    };

    const isAdmin = () => {
        return isLoggedIn && profile.user_type_id === 2;
    };

    const getProfile = ()=>{
        return profile;
    }

    return (
        <AuthContext.Provider value={{isLoggedIn, isAdmin, login, logout, getProfile}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);