import React from 'react';
import {Link} from 'react-router-dom'
import NotFoundImage from '../images/undraw_page_not_found.svg';
import '../styles/NotFound.scss'
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div>
        <div className="not-found-div">
            <img 
                src={NotFoundImage} 
                alt="notFoundImage" 
            />
            <Link 
                to="/" 
                className="home-page"
            >
                Go to HomePage
            </Link>
        </div>
        <Footer /> 
    </div>
  )
}
