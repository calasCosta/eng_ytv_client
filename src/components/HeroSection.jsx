import React, {useState, useEffect} from 'react';
import '../styles/HeroSection.scss';
import downArrow from '../images/downArrow.png';
import learningSVG from '../images/undraw_online_learning.svg';
import axios from 'axios';
import Definition from './Definition';


const ExpressionOfTheDay = (props)=>{

    return <div className='word-of-the-day-div'>
              <p style={{textAlign: 'center', opacity:0.4}}> Expression of the day </p>
              <h1> {props.title} </h1>
              <Definition 
                        expression={props.expression}
                        shortdef = {props.shortdef}
                        prs = {props.prs}
                        fl = {props.fl}
                        stems = {props.stems}
                    />
          </div>
}


export default function HeroSection() {
  const[expressionOfTheDay, setExpressionOfTheDay] = useState({});

  useEffect(()=>{ 
      axios
          .get(process.env.REACT_APP_BACKEND_LOCALHOST + "/expressionOfTheDay")
          .then(response => setExpressionOfTheDay(response.data))
          .catch(console.err);
  }, [])

  return (
    <section className='hero-section'>

      <div className='main-div-inside'>

        {  expressionOfTheDay.def &&     
          <ExpressionOfTheDay 

            expression={expressionOfTheDay.expression}
            shortdef={expressionOfTheDay.def.meaning && expressionOfTheDay.def.meaning}
            prs = {expressionOfTheDay.def.prs ? expressionOfTheDay.def.prs : "none"}
            fl={expressionOfTheDay.def.fl && expressionOfTheDay.def.fl}
            stems={expressionOfTheDay.def.stems && expressionOfTheDay.def.stems}
          /> 
        }
      
        <div> 
          <img 
              className='learning-image'
              src={learningSVG} 
              alt="learning.svg" 
          />
        </div>
      
        <img 
            className='down-arrown' 
            src={downArrow} 
            alt='downArrow-icon' 
        />
      
      </div>
    
    </section>
  )
}
