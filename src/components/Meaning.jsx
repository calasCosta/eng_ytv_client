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
    const[display, setDisplay] = useState(props.display);
    const{playlistId, videoId, playlistTitle, videoCode} = useParams();
    const[ result, setResult] = useState({});

    const {getProfile} = useAuth();
  
    useEffect(() =>{
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${props.expression}?key=${process.env.REACT_APP_MERRIAM_WEBSTER_KEY}`);
                const definition = response.data[0];

                const expression = {
                    expression: props.expression,
                    meaning: definition.shortdef && definition.shortdef,
                    fl: definition.fl,
                    prs: definition.hwi && definition.hwi.prs && definition.hwi.prs[0].mw,
                    audioName: definition.hwi && definition.hwi.prs && definition.hwi.prs[0].sound.audio,
                    stems: definition.meta.stems && definition.meta.stems,
                    userId: getProfile().user_id
                };

                setResult(expression);
                setDisplay(props.display);

                console.log('Result:', expression); // Log the updated expression for debugging
                console.log('Meaning:', expression.meaning); // Log the updated meaning for debugging
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
           
    }, [getProfile, props.display, props.expression]);


    useEffect(() => {
        console.log('Current Result:', result); // Log the current state of result for debugging
        console.log('Current Meaning:', result.meaning); // Log the current state of meaning for debugging
    }, [result]);

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
                console.log(Object.keys(result).length !== 0 && result.meaning.length > 0)
            }

            {
                
                (Object.keys(result).length !== 0 && result.meaning && result.meaning.length > 0) ? (
                    <>
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
                    </> 
                
                ) : (
                    <p style={{textAlign: 'center'}}> Sorry, no meaning found! </p>
                )

            }
        </div>
    )
}
