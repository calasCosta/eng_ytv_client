import React from 'react'
import '../styles/Definition.scss';
import playAudio from './playAudio'; 
import { SlVolume2 } from "react-icons/sl";

export default function Definition(props) {

  return (
    <>
        <h2> {props.expression}  </h2>

        <p style={{opacity: 0.4}}> Meaning: </p>

        <div className="def">
            {  
            ( !!props.shortdef !== false ) ? (
                    props.shortdef.map((d, index)=> 
                            <p key={index}>
                                {d}
                            </p> )
                ) : (" ")
            }
        </div>
            
        <p> 
            <span className='title-span'>
                Pronunciation: 
            </span> 

            {props.prs}

            {
                props.audioName &&
                                <span 
                                    style={{marginLeft:'2%'}}
                                    onClick={()=>playAudio(props.audioName)}
                                >
                                    <SlVolume2 />
                                </span>
            }
        </p>
        <p>
            <span className='title-span'> fl:</span>  {props.fl}
        </p>

        <p className='stems-p'>
            <span className='title-span'> stems:</span> {
                        props.stems && 
                            props.stems.map((s)=> <span> {s}, </span>)
                    }
        </p>
    </>
  )
}
