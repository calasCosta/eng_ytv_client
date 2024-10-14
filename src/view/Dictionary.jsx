import React, {useState, useRef} from 'react';
import Footer from '../components/Footer'
import Meaning from '../components/Meaning';
import { PiMagnifyingGlassThin } from "react-icons/pi";
import '../styles/SearchInput.scss';
import '../styles/Dictionary.scss';


export default function Dictionary() {

    const handleSearch = (e) => {
        e.preventDefault();

        setExpression(inputRef.current.value);
        setDisplayMeaning("block")
    };

    const[expression, setExpression] = useState("");
    const[displayMeaning, setDisplayMeaning] = useState("none"); 
    const inputRef = useRef();


    return (
        <>
            <section className="search-container">
                
                <div className='search-div'>
                        <input 
                            className='search-input'
                            type="text" 
                            placeholder='add new expression/word' 
                            ref={inputRef}   
                            onKeyDown={(e)=> {
                                if(e.key === 'Enter'){
                                    handleSearch(e);
                                    inputRef.current.value = "";
                                }
                            }}              
                            required
                        />
                        <button 
                            type='submit'
                            className='search-btn'
                            onClick={(e)=> {
                                handleSearch(e);
                                inputRef.current.value = "";
                            }}
                        > 
                            <PiMagnifyingGlassThin/>
                        </button>
                </div>

                <Meaning 
                    expression={expression}
                    display={displayMeaning}
                />
            </section>

            <Footer />
        </>
    )
}
