import { ActionIcon, Center, Group, rem, Slider, Stack } from '@mantine/core';
import { IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward, IconPlayerPause } from '@tabler/icons-react';
import classes from './Footer.module.css';
import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';


interface FooterProps {
  playlist: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}


export function Footer({ playlist, currentIndex, setCurrentIndex }: FooterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const currentSong = playlist[currentIndex] ?? null;


  useEffect(() => {
    if (currentSong) {
      setIsPlaying(true);
      setProgress(0);
    }
  }, [currentSong]);


  const handleSeek = (value: number) => {
    setProgress(value); // Aktualizuj stan suwaka
    playerRef.current?.seekTo(value / 100, 'fraction'); // Seek do % pozycji
  };

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    console.log(currentSong);
    
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className={classes.footer}>
      <ReactPlayer
        ref={playerRef}
        url={currentSong || undefined}
        playing={isPlaying}
        width="0%"
        height="0%"
        onEnded={handleNext}
        onProgress={({ played }) => {
          if (!isSeeking) setProgress(played * 100);
        }}
      />

      <Stack gap="xs" w="80%">
        <Center>
          <Group gap="md">
            <ActionIcon size="xl" variant="subtle" onClick={handlePrev}>
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
            <ActionIcon size="xl" variant="subtle" onClick={handleNext}>
              <IconPlayerSkipForward size={rem(24)} />
            </ActionIcon>
          </Group>
        </Center>

        <Slider
          value={progress}
          onChange={handleSeek}
          onMouseDown={() => setIsSeeking(true)}
          onMouseUp={() => setIsSeeking(false)}
          onTouchStart={() => setIsSeeking(true)}
          onTouchEnd={() => setIsSeeking(false)}
          color="white"
          size="sm"
          radius="xl"
          className={classes.slider}
        />
      </Stack>
    </div>
  );
}
