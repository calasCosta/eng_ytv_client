import React, { useEffect, useState } from 'react';
import '../../styles/Playlists.scss';
import axios from 'axios';
import Playlist from './Playlist';
import { useAuth } from '../auth/AuthContext';

export default function Playlists() {
  const[playlists, setPlaylists] = useState([]);
  const[playlistName, setPlaylistName] = useState("");

  const { isLoggedIn, getProfile } = useAuth();

  useEffect(() => {
      console.log("user id::: " + getProfile().user_id);
      axios
          .get(process.env.REACT_APP_BACKEND_LOCALHOST + "/playlists/"+getProfile().user_id)
          .then(response => {
            console.log(response)
            setPlaylists(response.data);
          })
          .catch(error => {
            console.log(error);
          })
  },[getProfile]);

  const handleSubmit = (event) =>{
    event.preventDefault();
    
    axios
      .post(process.env.REACT_APP_BACKEND_LOCALHOST+ "/createPlaylist", {
        playlistObj: {
          title: playlistName,
          user_id: getProfile().user_id
        }
      })
      .then((response) => {
        setPlaylists(response.data);
      })
      .catch(console.log);

      setPlaylistName("");
  }

  return (
    <section className="playlists" id="playlists">
          {isLoggedIn() ?
            <div className='playlists-inside-div'>
                <h2>Playlists</h2>
                <div>
                    { 
                        playlists
                            .map((p) => 
                                      <Playlist 
                                        id={p.playlist_id}
                                        key={p.playlist_id} 
                                        title={p.playlist_title} 
                                        setPlaylists={setPlaylists}
                                      />
                    )}
                </div>

                <div>
                    <form className='create-playlist' onSubmit={handleSubmit}>
                      <input 
                        type="text" 
                        placeholder='input the new playlist name'
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                      />
          
                      <button type="submit"> 
                          Create
                      </button>
                    </form>
                </div>
          </div>
          :
          <div className='signin-first'>
            <h3>Sign in to be able to create and see playlists</h3>
          </div>
        }
    </section>
  )
}
