import { AppShell } from "@mantine/core";
import React from 'react';
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { useState } from 'react';
import { Playlist } from "../components/Playlist/Playlist";
import {Song} from "../types/Song";


export const CommonLayout = ({ children }: any) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState('Playlista 1'); // ← przeglądana
  const [playingPlaylist, setPlayingPlaylist] = useState('Playlista 1');   // ← odtwarzana
  const [playlistData, setPlaylistData] = useState<{ [key: string]: Song[] }>({
    'Playlista 1': [],
    'Playlista 2': [],
    'Playlista 3': []
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSongSelect = (playlistName: string, url: string, index: number) => {
    setPlayingPlaylist(playlistName);
    setCurrentIndex(index);
  };

  const handleAddSong = (song: Song) => {
    setPlaylistData(prev => ({
      ...prev,
      [selectedPlaylist]: [...(prev[selectedPlaylist] || []), song]
    }));
  };

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 250, breakpoint: 'sm' }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar onSelect={setSelectedPlaylist} />
      </AppShell.Navbar>

      <AppShell.Main style={{ paddingLeft: 300 }}>
        <Playlist
          selected={selectedPlaylist}
          songs={playlistData[selectedPlaylist] || []}
          onAddSong={handleAddSong}
          onSongSelect={(url, index) => handleSongSelect(selectedPlaylist, url, index)}
        />
      </AppShell.Main>

      <AppShell.Footer>
        <Footer
          playlist={(playlistData[playingPlaylist] || []).map(song => song)}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </AppShell.Footer>
    </AppShell>
  );
};