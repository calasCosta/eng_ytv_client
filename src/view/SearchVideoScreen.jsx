import React, {useState} from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../styles/Search.scss';
//import { PiMagnifyingGlassThin } from "react-icons/pi";
import { TbPlaylistAdd } from "react-icons/tb";
import Footer from '../components/Footer';
import { useAuth } from '../components/auth/AuthContext';
import SearchComponent from '../components/SearchComponent';

export default function SearchVideoScreen() {
    const[keyWord, setKeyWord]= useState("");
    const[results, setResults]= useState([]);
    const{playlistId, playlistTitle} = useParams();
    const navigate = useNavigate();
    //const[submitBtnClicked, setSubmitBtnClicked] = useState(false);

    const {getProfile} = useAuth();

    const handleSearch = (event, submitBtnClicked)=> {

        if(event.key === 'Enter' || submitBtnClicked) {
            let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${keyWord}&type=video&key=${process.env.REACT_APP_YT_KEY}`;
            axios.get(url)
                .then((r) => {
                    console.log(r.data.items); setResults([...r.data.items])
                })
                .catch(err => console.error(err))
            
            setKeyWord("");
        }
    }

    const handleAddVideo = (videoTitle, yt_video_code, thumbnailLink)=> {

        let dataObject = {
            videoTitle: videoTitle,
            videoUrl: null,
            addAt: null,
            playlistId: playlistId,
            userId: getProfile().user_id,
            yt_video_code: yt_video_code,
            thumbnail: thumbnailLink
        }

        console.log(dataObject);

        axios.post(process.env.REACT_APP_BACKEND_LOCALHOST + `/playlist/${playlistId}/addVideo`, {dataObject})
             .then(response => {
                            console.log(response);  
                            navigate(-1); //go back
             })
             .catch(err => console.error(err))
    }

    return (
        <div>
            <SearchComponent 
                placeholder={`Search videos to playlist ${playlistTitle}`}
                handleSearch={handleSearch}
                setKeyWord={setKeyWord}
            />
         
            <section className='videos-found-section'>
                {
                    results.map((result, index) =>
                        <VideoFound 
                            key={index}
                            title={result.snippet.title}
                            src={result.snippet.thumbnails.medium.url}
                            channelId={result.snippet.channelId}
                            handleAddVideo={()=> handleAddVideo(
                                                result.snippet.title,
                                                result.id.videoId,
                                                result.snippet.thumbnails.medium.url
                                            )}
                        />
                    )
                }
            </section>
            <Footer />     
        
        </div>
    )
}


function VideoFound(props) {
    const[channelSnippet, setChannelSnippet] = useState({});
    const[channelThumbnail, setChannelThumbnail] = useState("");
    const[channelTitle, setChannelTitle] = useState("");
    
    /*let url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${props.channelId}&key=${process.env.REACT_APP_YT_KEY}`;

    axios.get(url)
         .then(result => {
                setChannelSnippet(result.data.items[0].snippet);
                setChannelThumbnail(channelSnippet.thumbnails.default.url);
                setChannelTitle(channelSnippet.title);
         })
         .catch(err => console.log(err));*/

    return (
        <article className='video-found'>
            <abbr title="">
                 <img src={props.src} alt="" className='thumbnail' />
            </abbr>
            
            <div className='bottom-div'>
                <img src="" alt="thumbnail" />
                <div>
                    <p>
                        {props.title}
                    </p>
                    <button className='add-video-btn' onClick={props.handleAddVideo}>
                        <TbPlaylistAdd />
                    </button>
                </div>
            </div>
        </article>
    );
}