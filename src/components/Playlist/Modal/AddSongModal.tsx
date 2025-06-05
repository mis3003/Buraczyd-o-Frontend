import { useState } from 'react';
import { Modal, TextInput, Button, ButtonGroup } from '@mantine/core';
import { fetchYoutubeTitle } from './YoutubeHandler';
import { fetchSpotifyTitle } from "./SpotifyHandler";
import { fetchSpotifyToken } from "../../../services/spotifyService";
import { CreateSongRequest } from "../../../types/Song";

interface AddSongModalProps {
  opened: boolean;
  onClose: () => void;
  onAddSong: (song: CreateSongRequest) => void; // Use CreateSongRequest instead
}

export function AddSongModal({ opened, onClose, onAddSong }: AddSongModalProps) {
  const [songURL, setSongUrl] = useState('');
  const [songName, setSongName] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'spotify'>('youtube');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!songURL.trim()) {
      alert('Podaj link do piosenki');
      return;
    }
    console.log('Dodawanie piosenki...');
    console.log('Link:', songURL);
    console.log('Platforma:', platform);
    console.log('Ręczna nazwa:', songName);


    setLoading(true);
    let title = songName.trim();

    try {
      // If no manual name provided, fetch from platform
      if (!title) {
        if (platform === 'youtube') {
          title = await fetchYoutubeTitle(songURL);
        } else if (platform === 'spotify') {
          const spotifyAccessToken = await fetchSpotifyToken();
          if (spotifyAccessToken) {
            title = (await fetchSpotifyTitle(songURL, spotifyAccessToken)) ?? "";
          }
        }
      }

      if (!title.trim()) {
        alert('Nie udało się pobrać nazwy piosenki');
        return;
      }

      // Create song object without playlistId (will be added by parent component)
      const newSong: CreateSongRequest = {
        title: title,
        platform: platform,
        songUrl: songURL
      };

      onAddSong(newSong);

      // Reset form
      setSongName('');
      setSongUrl('');
      setPlatform('youtube');
      onClose();

    } catch (error) {
      console.error('Error adding song:', error);
      alert('Błąd podczas dodawania piosenki');
    } finally {
      setLoading(false);
    }
  };

  return (
      <Modal opened={opened} onClose={onClose} title="Dodaj piosenkę">
        <ButtonGroup mb="md">
          <Button
              variant={platform === 'youtube' ? 'filled' : 'outline'}
              onClick={() => setPlatform('youtube')}
              disabled={loading}
          >
            Youtube
          </Button>
          <Button
              variant={platform === 'spotify' ? 'filled' : 'outline'}
              onClick={() => setPlatform('spotify')}
              disabled={loading}
          >
            Spotify
          </Button>
        </ButtonGroup>

        <TextInput
            label="Link do piosenki"
            placeholder="Wklej link do piosenki"
            value={songURL}
            onChange={(event) => setSongUrl(event.currentTarget.value)}
            mb="md"
            disabled={loading}
            required
        />

        <TextInput
            label="Nazwa piosenki (opcjonalne)"
            placeholder="Zostaw puste aby pobrać automatycznie"
            value={songName}
            onChange={(event) => setSongName(event.currentTarget.value)}
            mb="md"
            disabled={loading}
        />

        <Button
            fullWidth
            onClick={handleAdd}
            loading={loading}
            disabled={!songURL.trim()}
        >
          Dodaj
        </Button>
      </Modal>
  );
}