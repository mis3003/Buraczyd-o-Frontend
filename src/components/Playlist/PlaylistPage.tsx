import React, { useState } from 'react';
import { Playlist } from './Playlist';
import {Song} from "../../types/Song";



export function PlaylistPage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState('Playlista 1');
  const [playlistData, setPlaylistData] = useState<{ [key: string]: Song[] }>({
    'Playlista 1': [],
    'Playlista 2': [
      { name: 'Piosenka 3',source:"youtube", url: 'https://www.youtube.com/watch?v=example3' },
      { name: 'Piosenka 4', source:"spotify",url: 'https://www.youtube.com/watch?v=example4' }
    ],
    'Playlista 3': []
  });

  const handleAddSong = (song: Song) => {
    setPlaylistData(prev => ({
      ...prev,
      [selectedPlaylist]: [...(prev[selectedPlaylist] || []), song]
    }));
  };

  const handleSongSelect = (url: string, index: number) => {
    // In a real app, this would trigger playback
    console.log(`Playing song at index ${index}: ${url}`);
  };

  return (
    <Playlist
      selected={selectedPlaylist}
      songs={playlistData[selectedPlaylist] || []}
      onAddSong={handleAddSong}
      onSongSelect={handleSongSelect}
    />
  );
}