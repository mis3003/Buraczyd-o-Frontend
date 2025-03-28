import { Title, Stack, Text } from '@mantine/core';
import classes from './Playlist.module.css';

const songs: Record<string, string[]> = {
    'Playlista 1': ['Piosenka 1', 'Piosenka 2', 'Piosenka 3'],
    'Playlista 2': ['Track A', 'Track B', 'Track C'],
    'Playlista 3': ['Hit X', 'Hit Y', 'Hit Z'],
  };
  
  // 2. Użyj go w komponencie
  export function Playlist({ selected }: { selected: string }) {
    return (
      <main>
        <h3>{selected}</h3>
        {songs[selected]?.map((song: string) => (
          <p key={song}>{song}</p>
        )) || <p>Wybierz playlistę</p>}
      </main>
    );
  }
