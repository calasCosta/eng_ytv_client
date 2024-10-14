import React, {useState, useEffect,useRef} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/Video.scss';
import axios from 'axios';
import YouTube from "react-youtube";
import Meaning from '../components/Meaning';
import LoadingBar from '../components/Loading';
import { useAuth } from '../components/auth/AuthContext';
import ChatComponent from '../components/chatGPT/ChatComponent';
import { convertOffsetToTime } from '../components/TimeHandler';
import he from 'he'

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
            //console.log("Heeerreeee for transcript:::::"+r.data)
            setLoadingBar(false);
        })
        .catch(err => {
            console.log(err); 
            setLoadingBar(false);
        });
    }, []);
    
    

    const removeHourDigits = (time)=>{
        let split = time.split(":");
        let hourDigits = split[0];

        if(parseInt(hourDigits) === 0) {
            return ""+split[1]+":"+split[2];
        }
        return time;
    }

    const offsetToLocalTimeString = (offset)=>{
        //console.log("Offset::::::: " + offset);
        let date = convertOffsetToTime(offset);
        return removeHourDigits(date);
    }

    const moveTo = (id)=>{
        let paragraph = document.getElementById(id);

        //console.log(id);

        if(paragraph){
            //console.log("Current:::", document.getElementById(id));
            
            paragraph.style.backgroundColor = "rgba(230, 227, 227, 0.527)";
            paragraph
                .scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',  // prevent the parent div to scroll
                });
            
            let previous = paragraph.previousElementSibling;
            if(previous != null){
                previous.style.background = "none";
            }
        }
    }

    const onPlayerStateChange = (event) => {
        const playerState = event.data;

        if (playerState === 1) {
            // Video is playing, so start updating the current time
            const intervalId =  setInterval(() => {
                const newTime = event.target.getCurrentTime();  
                moveTo(offsetToLocalTimeString(newTime));

            }, 1000); // Update every second

            // Save the interval ID to clear it when the video stops
            setCurrentInterval(intervalId);
        } else {
            // Video is not playing, so clear the interval
            clearInterval(currentInterval);
        }
    };
    
    const seekTime = (timeInMilliSeconds) => {
        console.log(timeInMilliSeconds);
        iframeRef.current.seekTo(timeInMilliSeconds, true);
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

                        <div className='ai-chat-div'>
                            AI
                        </div>
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
                                    (transcript && transcript.length) ? (
                                        
                                        transcript.map((l, index) => 

                                        <p 
                                            key={index} 
                                            id={offsetToLocalTimeString(l.offset)} 
                                        > 
                                            <span 
                                                className='timeline' 
                                                onClick={()=> seekTime(l.offset)}>
                                                {offsetToLocalTimeString(l.offset)}
                                            </span> 

                                            {
                                                l.text && he.decode(l.text)
                                                    .split(" ")
                                                    .map((word, id) =>  
                                                            <span 
                                                                className='word'
                                                                key={id}
                                                                onClick={()=> {
                                                                    setDisplayMeaning("block");
                                                                    setExpression(word);
                                                                }}
                                                                dangerouslySetInnerHTML={{ __html: word +" "}} //decode words
                                                            /> 
                                                    )
                                            }
                                        </p>)
                                    ):(
                                        <p>Sorry! No transcript found.</p>
                                    )
                                }
                            </div>
                        </>) 
                        }
                    </div>
        </section>
        </>)
}
