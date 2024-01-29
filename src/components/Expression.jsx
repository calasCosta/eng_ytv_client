import React, {useState, useEffect} from 'react';
import '../styles/Expressions.scss'
import axios from 'axios';
import { toast } from "react-toastify";
import { CiTrash } from "react-icons/ci";
import { useAuth } from './auth/AuthContext';
import Definition from './Definition';

export default function Expression(props){ 
    const[firstButtonTitle, setFirstButtonTitle] = useState("");
    const[secondButtonTitle, setSecondButtonTitle] = useState("");

    const[firtButtonClassName, setFirstButtonClassName] = useState("");
    const[secondButtonClassName, setSecondButtonClassName] = useState("");

    const {getProfile} = useAuth();

    useEffect(() => {

            switch(props.recognitionLevel){
                case 1: 
                    setFirstButtonTitle("unknown");
                    setFirstButtonClassName("unknown-btn");
                    setSecondButtonTitle("to know");
                    setSecondButtonClassName("to-know-btn");
                    break;
                case 2: 
                    setFirstButtonTitle("known");
                    setFirstButtonClassName("known-btn");
                    setSecondButtonTitle("to know");
                    setSecondButtonClassName("to-know-btn");
                    break;
                case 3: 
                    setFirstButtonTitle("known");
                    setFirstButtonClassName("known-btn");
                    setSecondButtonTitle("unknown");
                    setSecondButtonClassName("unknown-btn");
                    break
                default: 
                    return "none";
            }
    }, [props.recognitionLevel]);

    const handleMoveExpression = (recognitionLevel) => {

        let recognitionLevelId;
        if(recognitionLevel === "known"){
            recognitionLevelId = 1;
        }else if(recognitionLevel === "unknown"){
            recognitionLevelId = 2;
        }else {
            recognitionLevelId = 3;
        }

        axios
            .post(process.env.REACT_APP_BACKEND_LOCALHOST +"/expressions/moveExpression/" + getProfile().user_id , {
                expressionId: props.expressionId,
                toRecognitionLevel: recognitionLevelId
            })
            .then(response => {
                props.setExpressions(response.data);
                toast.success("Expression moved successfully", {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
            })
            .catch(err => {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
                console.log(err.message);
            });
    };

    const handleDeleteExpression = ()=>{
        axios
            .post(process.env.REACT_APP_BACKEND_LOCALHOST +"/expressions/deleteExpression",{
                expressionId: props.expressionId,
            })
            .then(response => {
                props.setExpressions(response.data);
                toast.success("Expression deleted successfully", {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
            })
            .catch(err => {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
                console.log(err.message);
            });
    }

    return (
        <div className='expression-div'>
 
                <div className='meaning-container'>
                    <Definition 
                        expression={props.expression}
                        shortdef = {props.shortdef}
                        prs = {props.prs}
                        audioName = {props.audioName}
                        fl = {props.fl}
                        stems = {props.stems}
                    />

                    <div className='recognition-div'>
                        <button
                            className="delete-expression-btn"
                            onClick={handleDeleteExpression}
                        > <CiTrash /> </button>

                        <div>
                            <button 
                                className={firtButtonClassName}
                                onClick={() => handleMoveExpression(firstButtonTitle)}
                            > {firstButtonTitle} </button>
                            
                            <button 
                                style={{marginLeft:"4%"}}
                                className={secondButtonClassName}
                                onClick={() => handleMoveExpression(secondButtonTitle)}
                            > {secondButtonTitle} </button>
                        </div>
                    </div>
                </div>
                
            </div>
    );
};