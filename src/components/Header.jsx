import React, {} from 'react';
import {Link} from 'react-router-dom'
import '../styles/Header.scss';
import { FcGoogle } from "react-icons/fc";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from './auth/AuthContext';

export default function Header() {

  const {isLoggedIn, isAdmin, login, logout, getProfile} = useAuth();

  const handleClick = () =>{
    document
        .querySelector("#check")
        .checked = false;
  }

  console.log(getProfile())

  return (
    <header>
      <div className='headerDiv'>
        <h3> 
          <Link to={"/"}>English With YTV</Link>
        </h3>

        <input type="checkbox" id="check"/>
        <label for="check" className="checkButton">
          <RxHamburgerMenu id='hamburger-icon'/>
          <IoCloseOutline id='close-icon'/>
        </label>

        <nav className='menu'>
          <Link to="/" onClick={handleClick}> Home </Link>
          
          {
            isLoggedIn() &&
            <Link to="/expressions" onClick={handleClick}> Expressions </Link>
          }

          <Link to="/about" onClick={handleClick}> About </Link>

          { isAdmin() &&
            <Link to="/admin" onClick={handleClick}> Admin Area </Link>
          }
          

          { 
              isLoggedIn() ? (
                  <div>
                    <Link 
                        className='auth-btn log-out-btn' 
                        onClick={()=> {logout(); handleClick()}}
                    > 
                        Sign out
                    </Link>
                    <abbr title={getProfile().username}>
                      <img 
                          src={getProfile().image_profile} 
                          alt="profile" 
                          width="40px" 
                          height="40px"
                          style={{borderRadius:"50%"}}
                      />
                    </abbr>
                    
                  </div>
               ) : 
              <Link 
                  className="auth-btn login-btn" 
                  onClick={() => {login(); handleClick()}}
              >
                  Sign in <FcGoogle />
              </Link>
          }

        </nav>
      </div>
    </header>
  )
}
