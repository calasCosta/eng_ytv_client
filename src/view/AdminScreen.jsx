import React, {useState, useEffect} from 'react'
import Footer from '../components/Footer'
import axios from 'axios';
import '../styles/Admin.scss';
import { useAuth } from '../components/auth/AuthContext';
import {timeAgo} from '../components/TimeHandler'

import { LuEyeOff } from "react-icons/lu";
import { LuEye } from "react-icons/lu";

import SearchComponent from '../components/SearchComponent';

const User = (props)=>{
    let time = timeAgo(props.registeredAt);

    return (
        <div className='user-div'>
            <div className='image-div'>
                <img 
                    src={props.imageProfile}
                    alt={props.username} 
                />
                <div className='availability-div'>
                   {
                        props.availability === 1 
                        ?
                            <LuEye />
                        :
                            <LuEyeOff />
                    } 
                </div>
                
            </div>
            
            <p>{props.username}</p>
            <p>Registered {time}</p>
            
            <div className='bottom-div'>
                <p>
                    {
                        props.userStateId === 1 ? "Active" : "Inactive"
                    }
                </p>     
                
                <button>
                    {
                        props.userStateId === 1 ? "Block" : "Unblock"
                    }
                </button>
            </div>
        </div>
    );
}

export default function AdminScreen() {
    const{isAdmin} = useAuth();

    if(!isAdmin()){
        window.location.href = "/notFound";
    }

    const[users, setUsers] = useState([]);
    const[keyWord, setKeyWord]= useState("");
    const[displayResetUsersBtn, setDisplayResetUsersBtn] = useState("none");

    const handleSearch = (event, submitBtnClicked)=> {

        if(event.key === 'Enter' || submitBtnClicked) {
            axios
                .patch(process.env.REACT_APP_BACKEND_LOCALHOST+"/users",{
                    searchKey: keyWord
                })
                .then(response => {setUsers(response.data); console.log(response.data);})
                .catch(err => console.error(err));
            
            setKeyWord("");
            setDisplayResetUsersBtn("block");
        }
    }

    const getUsers = ()=>{
        axios
            .get(process.env.REACT_APP_BACKEND_LOCALHOST + '/users')
            .then(response => {
                setUsers(response.data); 
                //console.log(response.data);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        getUsers();
    }, []);

    const resetSearch = () => {
        getUsers();
        setDisplayResetUsersBtn("none");
    }

    return (
        <div>
            <SearchComponent 
                placeholder="write the username and click the enter keyword, or magnifying glass button"
                handleSearch={handleSearch}
                setKeyWord={setKeyWord}
            />

            <div className='close-search-div' style={{display: displayResetUsersBtn}}>
                <button 
                    
                    onClick={resetSearch}
                >   
                    X
                </button>
            </div>

            <section className='admin-section'>
                {
                    users.map((user) => 
                        <User 
                            key={user.user_id}
                            username={user.username}
                            imageProfile={user.image_profile}
                            registeredAt={user.registered_at}
                            availability={user.user_auth_state_id}
                            userStateId={user.user_state_id}
                        />
                    )
                }
            </section>

            <Footer/>
        </div>
    )
}
