import { useState } from 'react';
import { Title, Stack, Text, Button, Group, ActionIcon } from '@mantine/core';
import { IconPlus, IconPlayerPlay } from '@tabler/icons-react';
import { AddSongModal } from './Modal/AddSongModal';
import {Song} from "../../types/Song";
import {PlaylistProps} from "../../types/Playlist";




export function Playlist({ selected, songs, onAddSong, onSongSelect }: PlaylistProps) {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <>
      <AddSongModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onAddSong={onAddSong}
      />

      <Group justify="space-between" mb="md">
        <Title order={3}>{selected}</Title>
        <Button onClick={() => setModalOpened(true)} leftSection={<IconPlus size={16} />}>
          Dodaj piosenkę
        </Button>
      </Group>

      <Stack>
        {songs.map((song, index) => (
          <Group key={song.url} justify="space-between">
            <Text>{song.name}</Text>
            <ActionIcon
              variant="filled"
              color="blue"
              size="lg"
              onClick={() => onSongSelect(song.url, index)}
            >
              <IconPlayerPlay size={18} />
            </ActionIcon>
          </Group>
        ))}
      </Stack>
    </>
  );
}
