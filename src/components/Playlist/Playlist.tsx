import { useState } from 'react';
import { Title, Stack, Text, Button, Group, ActionIcon } from '@mantine/core';
import { IconPlus, IconPlayerPlay } from '@tabler/icons-react';
import { AddSongModal } from './Modal/AddSongModal';

interface PlaylistProps {
  selected: string;
}

export function Playlist({ selected }: PlaylistProps) {
  const [songs, setSongs] = useState<{ [key: string]: string[] }>({
    'Playlista 1': ['Piosenka 1', 'Piosenka 2'],
    'Playlista 2': ['Piosenka 3', 'Piosenka 4'],
    'Playlista 3': ['Piosenka 5', 'Piosenka 6'],
  });

  const [modalOpened, setModalOpened] = useState(false);

  const addSong = (song: string) => {
    setSongs((prev) => ({
      ...prev,
      [selected]: [...(prev[selected] || []), song],
    }));
  };

  return (
    <>
      {/* Komponent modal */}
      <AddSongModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onAddSong={addSong}
      />

      {/* Header playlisty */}
      <Group justify="space-between" mb="md">
        <Title order={3}>{selected}</Title>
        <Button onClick={() => setModalOpened(true)} leftSection={<IconPlus size={16} />}>
          Dodaj piosenkę
        </Button>
      </Group>

      {/* Lista piosenek */}
      <Stack>
        {songs[selected]?.map((song) => (
          <Group key={song} justify="space-between">
            <Text>{song}</Text>
            <ActionIcon variant="filled" color="blue" size="lg">
              <IconPlayerPlay size={18} />
            </ActionIcon>
          </Group>
        )) || <Text>Wybierz playlistę</Text>}
      </Stack>
    </>
  );
}
