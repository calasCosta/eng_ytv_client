import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import "react-toastify/dist/ReactToastify.css";
import Home from './view/Home';
import PlaylistScreen from './view/PlaylistScreen'; 
import SearchVideoScreen from './view/SearchVideoScreen';
import Video from './view/Video';
import Expressions from './view/Expressions';
import RecognitionLevel from './view/RecognitionLevel';
import About from './view/About';
import Header from './components/Header';
import NotFound from './view/NotFound';
import Admin from './view/AdminScreen'; 
import { AuthProvider } from './components/auth/AuthContext';
import { ToastContainer } from "react-toastify";

function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={ <Home/>} />
          <Route path="/playlist/:playlistId/:playlistTitle" element={ <PlaylistScreen />} />
          <Route path="/playlist/:playlistId/:playlistTitle/addVideo" element={ <SearchVideoScreen />} />
          <Route path="/playlist/:playlistId/:playlistTitle/:videoId/:videoCode" element={ <Video />} />
          <Route path="/expressions" element={ <Expressions />} />
          <Route path="/expressions/:recognitionLevelId/:recognitionLevel" element={<RecognitionLevel />} />
          <Route path='/about' element={ <About />} />
          <Route path="/notFound" element={ <NotFound />} />
          <Route path="/admin" element={ <Admin />} />
        </Routes>   
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
