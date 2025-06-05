import React, { useEffect, useState } from 'react';
import { Playlist as PlaylistComponent } from './Playlist';
import { Playlist } from '../../types/Playlist'; // Import the data interface, not PlaylistProps
import { CreateSongRequest, Song } from '../../types/Song';
import { getUserPlaylistsWithSongs } from '../../services/playlistService';
import { createSong } from '../../services/songService';

export function PlaylistPage() {
  // Now using the correct Playlist data interface
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        console.log('Fetching playlists');
        setLoading(true);
        setError(null);

        const data = await getUserPlaylistsWithSongs();

        setPlaylists(data);
        if (data.length > 0 && data[0].playlistId) {
          setSelectedPlaylistId(data[0].playlistId);
        }
      } catch (err) {
        console.error('Failed to fetch playlists:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleAddSong = async (songRequest: CreateSongRequest) => {
    if (!selectedPlaylistId) return;

    try {
      // Create the song object with playlistId for the API call
      const songWithPlaylistId: Song = {
        ...songRequest,
        playlistId: selectedPlaylistId
      };

      // Call your API to create the song
      const createdSong = await createSong(songWithPlaylistId);

      // Update local state
      setPlaylists(prev =>
          prev.map(playlist =>
              playlist.playlistId === selectedPlaylistId
                  ? { ...playlist, songs: [...(playlist.songs || []), createdSong] }
                  : playlist
          )
      );
    } catch (error) {
      console.error('Error adding song:', error);
      alert('Błąd podczas dodawania piosenki');
    }
  };

  const handleSongSelect = (url: string, index: number) => {
    console.log(`Playing song at index ${index}: ${url}`);
    // Add your song playing logic here
  };

  if (loading) {
    return <p>Ładowanie playlist...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  if (playlists.length === 0) {
    return <p>Brak playlist</p>;
  }

  const selectedPlaylist = playlists.find(p => p.playlistId === selectedPlaylistId);

  return selectedPlaylist ? (
      <PlaylistComponent
          id={selectedPlaylist.playlistId}
          selected={selectedPlaylist.name} // Now this works because selectedPlaylist is of type Playlist
          songs={selectedPlaylist.songs || []}
          onAddSong={handleAddSong}
          onSongSelect={handleSongSelect}
      />
  ) : (
      <p>Nie znaleziono wybranej playlisty</p>
  );
}