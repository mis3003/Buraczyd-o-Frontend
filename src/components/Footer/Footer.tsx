import { ActionIcon, Center, Group, Slider, Stack, Text } from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconPlayerPause
} from '@tabler/icons-react';
import classes from './Footer.module.css';
import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Song } from '../../types/Song';
import WebPlayback from '../WebPlayback/Webplayback';
import { fetchSpotifyToken } from '../../api/spotifyApi';

interface FooterProps {
  playlist: Song[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export function Footer({ playlist, currentIndex, setCurrentIndex }: FooterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [source, setSource] = useState<'youtube' | 'spotify'>('youtube');
  const playerRef = useRef<ReactPlayer>(null);
  const [token, setToken] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [duration, setDuration] = useState(0); // Track duration in milliseconds for Spotify, seconds for YouTube
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(null);
  const currentSong = playlist[currentIndex] ?? null;

  // Handle Spotify seeking using player.seek()
  const handleSeekSpotify = async (value: number) => {
    if (!spotifyPlayer || duration === 0) return;
    const positionMs = (value / 100) * duration;
    try {
      await spotifyPlayer.seek(positionMs);
      console.log(`[Spotify] Seeked to ${positionMs}ms`);
    } catch (err) {
      console.error('Failed to seek in Spotify:', err);
    }
  };

  // Handle YouTube seeking
  const handleSeekYouTube = (value: number) => {
    if (playerRef.current && duration > 0) {
      const seekTime = (value / 100) * duration;
      playerRef.current.seekTo(seekTime, 'seconds');
    }
  };

  // Handle progress updates from Spotify
  const handleSpotifyProgress = (progressPercent: number, trackDuration: number) => {
    if (!isSeeking) {
      setProgress(Math.min(progressPercent, 100)); // Ensure progress doesn't exceed 100%
      if (trackDuration > 0) {
        setDuration(trackDuration);
      }

      // Check if track ended
      if (progressPercent >= 99.5 && isPlaying) {
        handleNext();
      }
    }
  };

  useEffect(() => {
    const getToken = async () => {
      const fetchedToken = await fetchSpotifyToken();
      setToken(fetchedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (currentSong) {
      setSource(currentSong.source);
      setProgress(0);
      setDuration(0);
      if (currentSong.source === 'youtube') {
        playerRef.current?.seekTo(0, 'fraction');
      }
    }
  }, [currentIndex, currentSong]);

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    } else {
      setCurrentIndex(playlist.length - 1);
      setIsPlaying(true);
    }
  };

  const handleSeek = (value: number) => {
    setProgress(value);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
    if (source === 'youtube') {
      handleSeekYouTube(progress);
    } else if (source === 'spotify') {
      handleSeekSpotify(progress);
    }
  };

  return (
      <div className={classes.footer}>
        {currentSong ? (
            source === 'youtube' ? (
                <ReactPlayer
                    ref={playerRef}
                    url={currentSong.url}
                    playing={isPlaying}
                    width="0%"
                    height="0%"
                    volume={volume}
                    onProgress={({ played, playedSeconds }) => {
                      if (!isSeeking) {
                        const newProgress = played * 100;
                        setProgress(newProgress);
                        if (newProgress >= 99.5 && isPlaying) {
                          handleNext();
                        }
                      }
                    }}
                    onDuration={(dur) => setDuration(dur)} // Set duration in seconds for YouTube
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={e => console.error('Błąd odtwarzania:', e)}
                />
            ) : source === 'spotify' && token ? (
                <>
                  <WebPlayback
                      token={token}
                      trackUri={currentSong.url}
                      isPlaying={isPlaying}
                      onTrackEnd={handleNext}
                      volume={volume}
                      onProgressUpdate={handleSpotifyProgress}
                      onPlayerReady={setSpotifyPlayer}
                  />
                </>
            ) : (
                <Text>Brak dostępnego źródła</Text>
            )
        ) : (
            <Text>Brak wybranego utworu</Text>
        )}

        <Stack gap="xs" w="80%">
          <Center>
            <Group gap="md">
              <ActionIcon size="xl" variant="subtle" onClick={handlePrev}>
                <IconPlayerSkipBack size={24} />
              </ActionIcon>

              <ActionIcon
                  size="xl"
                  variant="filled"
                  radius="xl"
                  className={classes.playButton}
                  onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <IconPlayerPause size={24} /> : <IconPlayerPlay size={24} />}
              </ActionIcon>

              <ActionIcon size="xl" variant="subtle" onClick={handleNext}>
                <IconPlayerSkipForward size={24} />
              </ActionIcon>
            </Group>
          </Center>

          <Slider
              value={progress}
              onChange={handleSeek}
              onMouseDown={() => setIsSeeking(true)}
              onMouseUp={handleSeekEnd}
              onTouchStart={() => setIsSeeking(true)}
              onTouchEnd={handleSeekEnd}
              color="white"
              size="sm"
              radius="xl"
              className={classes.slider}
          />

          <Slider
              value={volume * 100}
              onChange={value => setVolume(value / 100)}
              color="gray"
              size="xs"
              radius="xl"
              className={classes.slider}
          />
        </Stack>
      </div>
  );
}