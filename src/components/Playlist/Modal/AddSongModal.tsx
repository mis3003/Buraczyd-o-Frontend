import { useState } from 'react';
import { Modal, TextInput, Button, ButtonGroup } from '@mantine/core';
import { fetchYoutubeTitle } from './YoutubeHandler';


interface Song {
  name: string;
  url: string;
}

interface AddSongModalProps {
  opened: boolean;
  onClose: () => void;
  onAddSong: (song: Song) => void; // <-- Zmienione!
}

export function AddSongModal({ opened, onClose, onAddSong }: AddSongModalProps) {
  const [songURL, setSongUrl]= useState('')
  const [songName, setSongName] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'spotify'>('youtube');
  
const handleYt = () => {
  const title=fetchYoutubeTitle(songURL)
  fetchYoutubeTitle(songURL).then(setSongName);

}

const handleAdd = async () => {
  let name = songName;

  if (platform === 'youtube' && !songName.trim()) {
    name = await fetchYoutubeTitle(songURL); // pobierz nazwę z YouTube
  }

  if (!name.trim()) return;

  onAddSong({ name, url: songURL }); // teraz przekazujemy oba
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
