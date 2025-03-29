import { useState } from 'react';
import { Modal, TextInput, Button, ButtonGroup } from '@mantine/core';

interface AddSongModalProps {
  opened: boolean;
  onClose: () => void;
  onAddSong: (song: string) => void;
}

export function AddSongModal({ opened, onClose, onAddSong }: AddSongModalProps) {
  const [songName, setSongName] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'spotify'>('youtube');
  const handleAdd = () => {
    if (!songName.trim()) return;
    onAddSong(songName);
    setSongName('');
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
        value={songName}
        onChange={(event) => setSongName(event.currentTarget.value)}
      />
      <Button fullWidth mt="md" onClick={handleAdd}>
        Dodaj
      </Button>
    </Modal>
  );
}
