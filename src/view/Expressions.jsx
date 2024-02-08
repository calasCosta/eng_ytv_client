import React from 'react';
import {Link} from 'react-router-dom'
import { useAuth } from '../components/auth/AuthContext';
import '../styles/Expressions.scss'
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
    const { isLoggedIn } = useAuth();
    
    if (!isLoggedIn() ) {
        window.location.href = "/notFound";
    }

    return (
        <div>
            <h2>Recognition Levels </h2>
            <p className="total-of-expression">Total of expression: {60}</p>

            <section className="recognition-levels">
                <RecognitionLevel 
                    backgroundColor={"rgb(194, 255, 242)"}
                    recognitionLevel={"Known Expressions"}
                    recognitionLevelId={1}
                    total={10}
                />

                <RecognitionLevel 
                    backgroundColor={"rgba(255, 186, 186, 0.466)"}
                    recognitionLevel={"Unknown Expressions"}
                    recognitionLevelId={2}
                    total={20}
                />

                <RecognitionLevel 
                    backgroundColor={"rgb(255, 249, 216, 0.541)"}
                    recognitionLevel={"To Know Expressions"}
                    recognitionLevelId={3}
                    total={30}
                />
            </section>
            
            <Footer /> 
        </div>
    )
}
