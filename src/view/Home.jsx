import React from 'react'
import HeroSection from '../components/HeroSection';
import Playlists from '../components/playlist/Playlists';
import Footer from '../components/Footer';

export default function Home() {

  return (
    <div>
      <HeroSection />
      <Playlists />
      <Footer />
    </div>
  )
}
