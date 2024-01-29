import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from './auth/AuthContext';
import axios from 'axios';
import '../styles/Meaning.scss';
import playAudio from './playAudio';
import { SlVolume2 } from "react-icons/sl";
import { CgSmileNone } from "react-icons/cg";

export default function Meaning(props) {
    const[searchDefinition, setSearchDefinition] = useState([]);
    const[display, setDisplay] = useState(props.display);
    const{playlistId, videoId, playlistTitle, videoCode} = useParams();
    const[ result, setResult] = useState({});

    const {getProfile} = useAuth();
  
    useEffect(() =>{
        axios
            .get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${props.expression}?key=${process.env.REACT_APP_MERRIAM_WEBSTER_KEY}`)
            .then(response => {
                setSearchDefinition(response.data[0]);
                
                const expression ={ 
                    expression: props.expression,
            
                    meaning: searchDefinition.shortdef && 
                                searchDefinition.shortdef,
            
                    fl: searchDefinition.fl,
            
                    prs: searchDefinition.hwi && 
                            searchDefinition.hwi.prs &&
                                searchDefinition.hwi.prs[0].mw,
            
                    audioName: searchDefinition.hwi && 
                                searchDefinition.hwi.prs &&
                                    searchDefinition.hwi.prs[0].sound.audio,
            
                    stems: searchDefinition.meta.stems && 
                                searchDefinition.meta.stems,
            
                    userId: getProfile().user_id
                }
                setResult(expression)
                setDisplay(props.display)
                console.log(response);
            })
            .catch(error => console.log(error));
           
    }, [getProfile, props.display, props.expression, searchDefinition.fl]);


    const handleAddExpression = (recognitionLevel) => {
        const meaning = result;
        meaning.recognitionLevel = recognitionLevel;

        axios
            .post(process.env.REACT_APP_BACKEND_LOCALHOST + `/playlist/${playlistId}/${playlistTitle}/${videoId}/${videoCode}/addExpression`, {   
                searchResult: meaning
            })
            .then( response => {
                props.updateExpressions(response.data)            
                toast.success( "Expression added successfully", {
                    position: toast.POSITION.BOTTOM_LEFT,
                })
            })
            .catch(console.error);
        setDisplay("none");
    };




    return (
        <div className='meaning-div' style={{display: `${display}`}}>
            <p 
                style={{ textAlign: 'center', opacity:0.4 }}
            > 
                Expression/Word
            </p>

            <button 
                className='close' 
                onClick={() => setDisplay("none") }
            > 
                x 
            </button>
            
            <h2> 
                {props.expression}                
            </h2>

            {
                (result && result.meaning) ? (<>
                    <p style={{opacity: 0.4}}> Meaning: </p>

                    {
                        result.meaning && 
                            result.meaning.map((d, id) => 
                                    <p style={{lineHeight: 1.2}} key={id}> {d} </p>
                            ) 
                    }

                    <p style={{marginBottom:'5%'}}> 
                        <span 
                            style={{opacity: 0.4}}
                        >
                            Pronunciation: 
                        </span> 
                        
                        {
                            result.prs ? (
                                result.prs
                            ) : (
                                <CgSmileNone />
                            )
                        }
                      
                        {
                            result
                                .audioName && 
                                    <span 
                                        style={{marginLeft:'2%', width:'50%'}}
                                        onClick={()=>playAudio(result.audioName)} 
                                    >
                                        <SlVolume2 />
                                    </span>
                        }
                        
                    </p>

                    
                    <div className='recognition-div'>
                        <button 
                            className='known-btn'
                            onClick={()=> handleAddExpression(1)}
                        > known </button>
                        <button 
                            className='unknown-btn'
                            onClick={()=> handleAddExpression(2)}
                        > unknown </button>
                        <button 
                            className='to-know-btn'
                            onClick={()=> handleAddExpression(3)}
                        > to know </button>
                    </div>
                </> ) : (
                    <p style={{textAlign: 'center'}}> Sorry, no meaning found! </p>
                )

            }
        </div>
    )
}
