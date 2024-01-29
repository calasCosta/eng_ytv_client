import React from 'react';
import '../styles/About.scss';
import { IoLogoLinkedin } from "react-icons/io";
import { GrDocumentUser } from "react-icons/gr";
import Footer from '../components/Footer';

export default function About() {
  return (
    <div>
      <main>
        <div>
          <p>
            Considering the high demand for the English language, as it is a predominant language 
            both in the labor market and in various spheres of our daily lives, and because many 
            language students resort to YouTube videos to improve their level, this project 
            aims to  allows the user to study English (it can be extended 
            to several languages in the future) through YouTube videos. This project is aimed at users 
            with a beginner and intermediate level of English, for fun, it can be used by advanced users.

            <div className='right'>
        
              <p>See about the developer:</p>
              <abbr title="Link id">
                <a href='https://www.linkedin.com/in/noami-costa-912a8518a/' target='blank' className='linkedIn contact'>
                  <IoLogoLinkedin />
                </a> 
              </abbr> 
              <abbr title="Portfolio">
                <a href='https://calascosta.github.io/ncc-portfolio/' target='blank' className='linkedIn contact'>
                    <GrDocumentUser />
                </a>
              </abbr>
            </div>
          </p>
        </div>
      </main>
      <Footer />        
    </div>
  )
}
