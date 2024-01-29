import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import {FaTrash} from 'react-icons/fa';
import { MdModeEditOutline } from "react-icons/md";


export default function Playlist (props){
    const[title, setTitle] = useState(props.title);
    const[displayButtonsValue, setDisplayButtons] = useState("none");
    const[displayEditInput, setDisplayEditInput] = useState("none");
    const[displayTitle, setDisplayTitle] = useState("block");
  
    const handleDelete = (e)=>{
        e.preventDefault(); // ingore link clicked action
        axios
          .post(process.env.REACT_APP_BACKEND_LOCALHOST+ "/deletePlaylist/" + props.id, {
              id: props.id
          })
          .then(response => props.setPlaylists(response.data));
    }
  
    const handleEditPlaylistDisplay = (e)=>{
        e.preventDefault(); // ingore link clicked action

        setDisplayEditInput(
            prev => (prev === "none") ? prev = "block" : prev = "none"
        );
        setDisplayTitle(
            prev => (prev === "block") ? prev = "none" : prev = "block"
        );
    };
  
  
    const handleEditPlaylist = (event)=> {
        event.preventDefault(); // ingore link clicked action

        if(title){
            axios
                .post(process.env.REACT_APP_BACKEND_LOCALHOST+ "/updatePlaylistName/" + props.id, {
                    title: title
                })
                .then(response => props.setPlaylists(response.data));

                handleEditPlaylistDisplay(event);
        }else{
            alert("Cannot submit empty title")
        }
    }
  
    return (
        <Link 
            to={`/playlist/${props.id}/${props.title}`} 
            className="playlist"
        >     

                <div 
                    className='playlist-div' 
                    onMouseEnter={()=>console.log("enter")} 
                    onMouseLeave={()=>{
                        setDisplayEditInput("none"); 
                        setDisplayTitle("block");
                        setTitle(`${props.title}`);
                    }}
                >
                    <div 
                        className='options' 
                        onMouseEnter={()=> setDisplayButtons("block")}
                        onMouseLeave={()=> setDisplayButtons("none")}
                    > 
                        <HiDotsVertical />
  
                        <div 
                        className="buttons" 
                        style={{display: `${displayButtonsValue}`}}
                        >
                        <button 
                            onClick={handleEditPlaylistDisplay}
                            className="editButton"
                        >
                            <MdModeEditOutline />
                        </button>
    
                        <button 
                            onClick={handleDelete}
                            className="deleteButton"
                        >
                            <FaTrash/>
                        </button>
                        </div>
                    </div>
  
                    <p 
                        className="playlist-title"
                        style={{display: `${displayTitle}`}}
                    > 
                        {title} 
                    </p>
    
                    <div 
                        className='edit-playlist-div'
                        style={{display: `${displayEditInput}`}}
                    >
                        <input 
                            className="playlist-title-input" 
                            value={title}
                            onChange={(e)=>{ setTitle(e.target.value)}}
                            type="text" 
                            onClick={e => e.preventDefault()}
                        />
                        <button onClick={handleEditPlaylist}> {">"} </button>
                    </div>
              </div>
        </Link>
    );
}