import React, {useState, useEffect,useRef} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/Video.scss';
import axios from 'axios';
import YouTube from "react-youtube";
import Meaning from '../components/Meaning';
import LoadingBar from '../components/Loading';
import { useAuth } from '../components/auth/AuthContext';

export default function Video() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn() ) {
        window.location.href = "/notFound";
    }

    const{ videoCode } = useParams();
    const[transcript, setTranscript] = useState([]);
    const{pathname} = useLocation();
    const[currentInterval, setCurrentInterval] = useState(null);
    const[expression, setExpression] = useState("");
    const[displayMeaning, setDisplayMeaning] = useState("none"); 
    const iframeRef = useRef();

    const[loadingBar, setLoadingBar] = useState(true)

    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND_LOCALHOST + pathname)
        .then((r) => {
            setTranscript(r.data);
            //console.log(r.data)
            setLoadingBar(false);
        })
        .catch(err => {
            console.log(err); 
            setLoadingBar(false);
        });
    }, []);
    
    let date = new Date();

    const removeHourDigits = (time)=>{
        let split = time.split(":");
        let hourDigits = split[0];

        if(parseInt(hourDigits) === 0) {
            return ""+split[1]+":"+split[2];
        }
        return time;
    }

    const offsetToLocalTimeString = (offset)=>{
        date.setTime(offset);
        return removeHourDigits(date.toLocaleTimeString());
    }

    
    const onPlayerStateChange = (event) => {
        const playerState = event.data;

        if (playerState === 1) {
            // Video is playing, so start updating the current time
            const intervalId =  setInterval(() => {
                const newTime = event.target.getCurrentTime();

                moveTo(offsetToLocalTimeString(newTime*1000));

            }, 1000); // Update every second

            // Save the interval ID to clear it when the video stops
            setCurrentInterval(intervalId);
        } else {
            // Video is not playing, so clear the interval
            clearInterval(currentInterval);
        }
    };

    const moveTo = (id)=>{
        let paragraph = document.getElementById(id);

        if(paragraph){
            //console.log("Current:::", document.getElementById(id));
            
            paragraph.style.backgroundColor = "rgba(230, 227, 227, 0.527)";
            paragraph
                .scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',  // prevent the parent div to scroll
                });
            
            let previous = paragraph.previousElementSibling;
            if(previous != null){
                previous.style.background = "none";
            }
        }
    }

    const seekToTime = (timeInMilliSeconds) => {
        console.log(timeInMilliSeconds);
        iframeRef.current.seekTo(parseInt(timeInMilliSeconds)/1000, true);
    };

    return ( <>
        
        <section className='video-section'>

                    <div className='iframe-div'>
                        <YouTube
                            id="iframe"
                            videoId={videoCode}
                            containerClassName="embed embed-youtube"
                            opts={{
                                playerVars: {
                                    autoplay: 1,
                                    start: 0
                                }
                            }}
                            onStateChange={onPlayerStateChange}
                            onReady={(e) => iframeRef.current = e.target}
                            
                        />
                    </div>

                    <Meaning 
                        expression={expression}
                        display={displayMeaning}
                        updateExpressions={()=>{}}
                    />

                    <div className='transcript-area' >

                        {
                        loadingBar ? (
                            <LoadingBar/>
                        ) : ( <>
                            <div id="transcript-div">
                                {
                                    transcript && transcript.map((l, index) => 

                                        <p 
                                            key={index} 
                                            id={offsetToLocalTimeString(l.offset)} 
                                        > 
                                            <span 
                                                className='timeline' 
                                                onClick={()=> seekToTime(l.offset)}>
                                                {offsetToLocalTimeString(l.offset)}
                                            </span> 

                                            {
                                                l.text
                                                    .split(" ")
                                                    .map((word, id) =>  
                                                            <span 
                                                                className='word'
                                                                key={id}
                                                                onClick={()=> {
                                                                    setExpression(word); 
                                                                    setDisplayMeaning("block");
                                                                }}
                                                            > 
                                                                {word + " "}
                                                            </span>)
                                            }
                                        </p>)
                                }
                            </div>
                        </>) 
                        }
                    </div>
        </section>
        </>)
}
