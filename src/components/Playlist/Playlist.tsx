import { useState } from 'react';
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
}

export function Playlist({ selected, onSongSelect }: PlaylistProps) {
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
    setSongs((prev) => ({
      ...prev,
      [selected]: [...(prev[selected] || []), song]
    }));
  };

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

