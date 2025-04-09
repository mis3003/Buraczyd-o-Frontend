import { useState, useEffect } from 'react';
import { Title, Stack, Text, Button, Group, ActionIcon } from '@mantine/core';
import { IconPlus, IconPlayerPlay } from '@tabler/icons-react';
import { AddSongModal } from './Modal/AddSongModal';

interface Song {
  name: string;
  url: string;
}

interface PlaylistProps {
  selected: string;
  onSongSelect: (url: string) => void;
  setPlaylist: (urls: string[]) => void; // Dodany props
}

export function Playlist({ selected, onSongSelect, setPlaylist }: PlaylistProps) {
  const [songs, setSongs] = useState<{ [key: string]: Song[] }>({
    'Playlista 1': [],
    'Playlista 2': [
      { name: 'Piosenka 3', url: 'https://www.youtube.com/watch?v=example3' },
      { name: 'Piosenka 4', url: 'https://www.youtube.com/watch?v=example4' }
    ],
    'Playlista 3': []
  });

  const [modalOpened, setModalOpened] = useState(false);

  const addSong = (song: Song) => {
    setSongs((prev) => {
      const updated = {
        ...prev,
        [selected]: [...(prev[selected] || []), song]
      };

      
      setPlaylist(updated[selected].map((s) => s.url));

      return updated;
    });
  };


  useEffect(() => {
    setPlaylist(songs[selected]?.map((s) => s.url) || []);
  }, [selected]);

  return (
    <>
      <AddSongModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onAddSong={addSong}
      />

      <Group justify="space-between" mb="md">
        <Title order={3}>{selected}</Title>
        <Button onClick={() => setModalOpened(true)} leftSection={<IconPlus size={16} />}>
          Dodaj piosenkę
        </Button>
      </Group>

      <Stack>
        {songs[selected]?.map((song) => (
          <Group key={song.url} justify="space-between">
            <Text>{song.name}</Text>
            <ActionIcon variant="filled" color="blue" size="lg" onClick={() => onSongSelect(song.url)}>
              <IconPlayerPlay size={18} />
            </ActionIcon>
          </Group>
        )) || <Text>Wybierz playlistę</Text>}
      </Stack>
    </>
  );
}
