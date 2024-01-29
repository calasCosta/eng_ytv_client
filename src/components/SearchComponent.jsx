import React, {useRef} from 'react'
import { PiMagnifyingGlassThin } from "react-icons/pi";
import '../styles/SearchInput.scss';


export default function SearchComponent(props) {
    const inputRef = useRef();


  return (
    <section className="search-container">
        <div className='search-div'>
            <input 
                className='search-input' 
                type="text" 
                placeholder={props.placeholder} 
                onChange={(e) => props.setKeyWord(e.target.value)}
                onKeyDown={props.handleSearch}
                required
                ref={inputRef}
            />
            <button 
                className='search-btn' 
                onClick={(e) => {
                    inputRef.current.value && 
                    props.handleSearch(e, true); 
                    inputRef.current.value = "";
                }}
            >
                <PiMagnifyingGlassThin className='magnifying-btn'/>
            </button>
        </div>
    </section>
  )
}


