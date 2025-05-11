import { ScrollArea, Stack, Title, Text } from '@mantine/core';
import classes from './Sidebar.module.css';

const playlists = ['Playlista 1', 'Playlista 2', 'Playlista 3'];

export function Sidebar({ onSelect }: { onSelect: (name: string) => void }) {
  return (
    <aside className={classes.sidebar}>
      <Title order={4} className={classes.title}>Biblioteka</Title>
      <ScrollArea h="80vh">
        <Stack>
          {playlists.map((name) => (
            <Text key={name} className={classes.item} onClick={() => onSelect(name)}>
              {name}
            </Text>
          ))}
        </Stack>
      </ScrollArea>
    </aside>
  );
}