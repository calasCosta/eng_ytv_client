import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import { useAuth } from '../components/auth/AuthContext';
import '../styles/Expressions.scss';
import axios from 'axios';
import Footer from '../components/Footer';



const RecognitionLevel = (props)=>{
    return (
        <div style={{ backgroundColor:`${props.backgroundColor}`}}>
            <Link to={`/expressions/${props.recognitionLevelId}/${props.recognitionLevel}`}>
                <h2>{props.recognitionLevel}</h2>
                <p>{props.total}</p>
            </Link>
        </div>
    );
}

export default function Expressions() {
    const {isLoggedIn, getProfile} = useAuth();
    const[expressions, setExpressions] = useState([]);
    
    if (!isLoggedIn()) {
        window.location.href = "/notFound";
    }

    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND_LOCALHOST + `/expressions/${getProfile().user_id}`)
           .then(response => {
                  setExpressions(response.data); 
                  console.log(response.data)
            })
           .catch(console.log);
    },[])
    

    const filterExpressions = (recognitionLevelId)=>{
        return expressions
                .filter(exp => exp.state_id === 1 && exp.recognition_level_id === parseInt(recognitionLevelId));
    }

    return (
        <div>
            <h2>Recognition Levels </h2>
            <p className="total-of-expression">Total of expression: {expressions.length}</p>

            <section className="recognition-levels">
                <RecognitionLevel 
                    backgroundColor={"rgb(194, 255, 242)"}
                    recognitionLevel={"Known Expressions"}
                    recognitionLevelId={1}
                    total={filterExpressions(1).length}
                />

                <RecognitionLevel 
                    backgroundColor={"rgba(255, 186, 186, 0.466)"}
                    recognitionLevel={"Unknown Expressions"}
                    recognitionLevelId={2}
                    total={filterExpressions(2).length}
                />

                <RecognitionLevel 
                    backgroundColor={"rgb(255, 249, 216, 0.541)"}
                    recognitionLevel={"To Know Expressions"}
                    recognitionLevelId={3}
                    total={filterExpressions(3).length}
                />
            </section>
            
            <Footer /> 
        </div>
    )
}
