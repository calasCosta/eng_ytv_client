import React, {useState, useEffect, useRef} from 'react';
import { useAuth } from '../components/auth/AuthContext';
import '../styles/Expressions.scss'
import axios from 'axios';
import Expression from '../components/Expression';
import Footer from '../components/Footer';
import Meaning from '../components/Meaning';
import { PiMagnifyingGlassThin } from "react-icons/pi";

const ExpressionSection = (props) => {
    const[filteredExpressions, setFilteredExpressions] = useState([]);

    useEffect(() => {
       
        setFilteredExpressions(props.expressions 
                                    && props.expressions.filter(expression => expression.state_id === 1 
                                    && expression.recognition_level_id === props.recognitionLEvel)
                                );

    }, [props.expressions, props.recognitionLEvel])

    
    return(
        <div className='div-inside'>
            <h1> {props.title}  ({filteredExpressions && filteredExpressions.length}) </h1>
            
            {
                filteredExpressions &&
                    filteredExpressions
                    .map(exp => 
                        <Expression 
                            key={exp.expression_id}
                            expressionId={exp.expression_id}
                            expression={exp.expression}
                            shortdef={exp.def.meaning}
                            prs={exp.def.prs && exp.def.prs}
                            audioName={exp.def.audioName && exp.def.audioName}
                            fl={exp.def.fl && exp.def.fl}
                            stems={exp.def.stems && exp.def.stems}
                            recognitionLevel={exp.recognition_level_id}
                            setExpressions={props.updateExpressions}
                        />
                    )
            }
        </div>
    ); 
};

export default function Expressions() {
    const { isLoggedIn, getProfile } = useAuth();
    const[expressions, setExpressions] = useState([]);
    const[expression, setExpression] = useState("");
    const[displayMeaning, setDisplayMeaning] = useState("none"); 
    const expressionRef = useRef();

    if (!isLoggedIn() ) {
        window.location.href = "/notFound";
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_LOCALHOST + `/expressions/${getProfile().user_id}`)
             .then(response => {setExpressions(response.data); console.log(response.data)})
             .catch(console.log);
    },[])

    const updateExpressions = (newList) => {
        setExpressions(newList);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setDisplayMeaning("block")
        setExpression(expressionRef.current.value);
    };

    return (
        <div>

            <div className='add-expression-div'>
                <form action="" onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        placeholder='add new expression/word' 
                        ref={expressionRef}                        
                        required
                    />
                    <button type='submit'> 
                        <PiMagnifyingGlassThin/>
                    </button>
                </form>

                <Meaning 
                    expression={expression}
                    display={displayMeaning}
                    updateExpressions={updateExpressions}
                />
            </div>

            <section className='known-expressions-section sections'>     
                    <ExpressionSection 
                        title={"Known Expressions"}
                        expressions={expressions}
                        recognitionLEvel={1}
                        updateExpressions={updateExpressions}
                    />
            </section>
            
            <section className='unknown-expressions-section sections'>
                    <ExpressionSection 
                        title={"UnKnown Expressions"}
                        expressions={expressions}
                        recognitionLEvel={2}
                        updateExpressions={updateExpressions}
                    />
            </section>
            
            <section className='to-know-expressions-section sections'>
                    <ExpressionSection 
                        title={"Expressions to know"}
                        expressions={expressions}
                        recognitionLEvel={3}
                        updateExpressions={updateExpressions}
                    />
            </section>
            
            <Footer /> 
        </div>
    )
}
