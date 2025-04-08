import { ActionIcon, Center, Group, rem, Slider, Stack } from '@mantine/core';
import { IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward, IconPlayerPause } from '@tabler/icons-react';
import classes from './Footer.module.css';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player'


export function Footer({ songUrl }: { songUrl: string | null })  {



  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 0));
      }, 1000); // Co sekundę przesuwa o 1%

      return () => clearInterval(interval); // Czyszczenie interwału po zatrzymaniu
    }
  }, [isPlaying]);

  return (
    <div className={classes.footer}>

      <ReactPlayer
             url={songUrl || undefined}
        playing={isPlaying}
        width="0%"
        height="0%"
        onProgress={({ played }) => setProgress(played * 100)} // ← aktualizuje pasek
      />
      <Stack gap="xs" w="80%">
        {/* Kontrolki */}
        <Center>
          <Group gap="md">
            <ActionIcon size="xl" variant="subtle" className={classes.button}>
              <IconPlayerSkipBack size={rem(24)} />
            </ActionIcon>

            <ActionIcon
              size="xl"
              variant="filled"
              radius="xl"
              className={classes.playButton}
              onClick={() => setIsPlaying((prev) => !prev)}
            >
              {isPlaying ? <IconPlayerPause size={rem(24)} /> : <IconPlayerPlay size={rem(24)} />}
            </ActionIcon>

            <ActionIcon size="xl" variant="subtle" className={classes.button}>
              <IconPlayerSkipForward size={rem(24)} />
            </ActionIcon>
          </Group>
        </Center>
        {/* Pasek postępu */}
        <Slider
          value={progress}
          onChange={setProgress}
          color="white"
          size="sm"
          radius="xl"
          className={classes.slider}
        />
      </Stack>
    </div>
  );
}