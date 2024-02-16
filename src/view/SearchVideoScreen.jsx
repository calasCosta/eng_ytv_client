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
    const handleSearch = async (event, submitBtnClicked) => {
        if (event.key === 'Enter' || submitBtnClicked) {
            try {
                const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${keyWord}&type=video&key=${process.env.REACT_APP_YT_KEY}`;
                const response = await axios.get(url);
                const searchResults = response.data.items;
    
                const requests = searchResults.map(async (item) => {
                    const videoId = item.id.videoId;
                    const videoUrl = `https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.REACT_APP_YT_KEY}&part=contentDetails`;
                    const videoResponse = await axios.get(videoUrl);
                    const duration = videoResponse.data.items[0].contentDetails.duration;
                    const totalSeconds = parseYouTubeDuration(duration);
                    const formattedDuration = formatDuration(totalSeconds);
                    item.duration = formattedDuration;
                    return item;
                });
    
                const updatedResults = await Promise.all(requests);
                setResults(updatedResults);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
    
            setKeyWord("");
        }
    };
    
    // Function to parse YouTube video duration into seconds
    function parseYouTubeDuration(duration) {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      
        const hours = (parseInt(match[1]) || 0);
        const minutes = (parseInt(match[2]) || 0);
        const seconds = (parseInt(match[3]) || 0);
      
        return hours * 3600 + minutes * 60 + seconds;
    }
      
    // Function to format duration into HH:MM:SS format (optional)
    function formatDuration(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if(hours > 0){
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    const handleAddVideo = (videoTitle, yt_video_code, thumbnailLink, duration)=> {

        let dataObject = {
            videoTitle: videoTitle,
            videoUrl: null,
            addAt: null,
            playlistId: playlistId,
            userId: getProfile().user_id,
            yt_video_code: yt_video_code,
            thumbnail: thumbnailLink,
            duration: duration
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
                            duration={result.duration} 
                            channelId={result.snippet.channelId}
                            handleAddVideo={()=> handleAddVideo(
                                                result.snippet.title,
                                                result.id.videoId,
                                                result.snippet.thumbnails.medium.url,
                                                result.duration
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
            
            <div className='title-channelprofile-div'>
                <img src="" alt="channel" />
                <p>
                    {props.title}
                </p>
            </div>
            <div className='bottom-div'> 
                <button 
                    className='add-video-btn' 
                    onClick={props.handleAddVideo}
                >
                    <TbPlaylistAdd />
                </button>

                {
                    props.duration && <p>{props.duration}</p>
                }
            </div>
        </article>
    );
}