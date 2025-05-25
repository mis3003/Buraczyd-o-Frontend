import { useState } from 'react';
import { Modal, TextInput, Button, ButtonGroup } from '@mantine/core';
import { fetchYoutubeTitle } from './YoutubeHandler';
import {fetchSpotifyTitle} from "./SpotifyHandler";
import {fetchSpotifyToken} from "../../../api/spotifyApi";
import {Song} from "../../../types/Song";





interface AddSongModalProps {
  opened: boolean;
  onClose: () => void;
  onAddSong: (song: Song) => void; // <-- Zmienione!
}

export function AddSongModal({ opened, onClose, onAddSong }: AddSongModalProps) {
  const [songURL, setSongUrl] = useState('')
  const [songName, setSongName] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'spotify'>('youtube');


  const handleAdd = async () => {
    let name = songName;

    if (!songName.trim()) {
      if (platform === 'youtube') {
        name = await fetchYoutubeTitle(songURL); // pobierz nazwę z YouTube
      } else if (platform === 'spotify') {
        const spotifyAccessToken = await fetchSpotifyToken(); // Poczekaj na string
        if (spotifyAccessToken) {
          name = (await fetchSpotifyTitle(songURL, spotifyAccessToken)) ?? "";

        }
      }
    }

    if (!name.trim()) return;

    onAddSong({ name, source:platform,url: songURL });
    setSongName('');
    setSongUrl('');
    onClose();
  };


  return (
    <Modal opened={opened} onClose={onClose} title="Dodaj piosenkę">
      <ButtonGroup>
        <Button
          variant={platform === 'youtube' ? 'filled' : 'outline'}
          onClick={() => setPlatform('youtube')}
        >
          Youtube
        </Button>
        <Button
          variant={platform === 'spotify' ? 'filled' : 'outline'}
          onClick={() => setPlatform('spotify')}
        >
          Spotify
        </Button>
      </ButtonGroup>
      <TextInput
        placeholder="Link do piosenki"
        value={songURL}
        onChange={(event) => setSongUrl(event.currentTarget.value)}
      />
      <Button fullWidth mt="md" onClick={handleAdd}>
        Dodaj
      </Button>
    </Modal>
  );
}
