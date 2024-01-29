import React, {useState, useEffect} from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { FcPlus } from "react-icons/fc";
import "../styles/Playlist.scss";
import axios from 'axios';
import { FaTrash } from "react-icons/fa";
import Footer from '../components/Footer';
import { useAuth } from '../components/auth/AuthContext';
import timeAgo from '../components/timeAgo';

function Video(props) {

  return (
      <article className='video'>
        <Link to={`${props.pathname}/${props.video_id}/${props.videoCode}`}>
            <img 
                src={props.src} 
                alt="" 
                className='thumbnail' 
            />
            <abbr  title={props.title && props.title}>
              <p className='title'>
                {props.title && (props.title.length < 75) ? props.title : props.title.substring(0, 75) +"..." } 
              </p> 
            </abbr>
            <div className='bottom-div'>
                <button onClick={props.handleDeleteVideo}>
                  <FaTrash/>
                </button>
                <p className='time-ago'> {props.addedAt} </p>
            </div>
        </Link>
      
      </article>
  );
}

export default function PlaylistScreen() {
  const{ playlistId, playlistTitle } = useParams();
  const[ videos, setVideos] = useState([]);
  const{pathname} = useLocation();

  const { isLoggedIn , getProfile} = useAuth();

  if (!isLoggedIn() ) {
      window.location.href = "/notFound";
  }

  const handleDeleteVideo = (event, videoId) => { 
    event.preventDefault();

    axios
        .post(process.env.REACT_APP_BACKEND_LOCALHOST + `/playlist/${playlistId}/deleteVideo/${videoId}`)
        .then(response => setVideos(response.data))
        .catch(err => console.log(err))
  };
  
  useEffect(() => {
    axios
        .get(process.env.REACT_APP_BACKEND_LOCALHOST + `/playlist/${playlistId}/getVideosByUserId/${getProfile().user_id}`)
        .then(response => setVideos(response.data))
        .catch(err => console.log(err))
  },[]);
  
  return (
    <div>

      <section className='videos-section'>
        <h1 style={{textAlign: "center"}}>{playlistTitle}</h1>

        <Link to={`${pathname}/addVideo`} className='add-video'> 
          <FcPlus/>
        </Link>

        <div className='videos-container'>
          {
            videos.length ?
            ( videos.map((v) =>
                  <Video 
                    key={v.video_id}
                    title={v.video_title}
                    src={v.thumbnail}
                    pathname={pathname}
                    video_id = {v.video_id}
                    videoCode={v.yt_video_code}
                    addedAt={timeAgo(v.added_at)}
                    handleDeleteVideo={(e)=> handleDeleteVideo(e, v.video_id)}
                  /> )
            ) : (
              <div className='nothing-yet-to-show'>
                <h3> Nothing to show yet. Feel free to add videos by clicking the plus button. </h3>
              </div>
            )
          }
        </div>
      </section>
      <Footer /> 
    </div>
  )
}


