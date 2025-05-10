import { ActionIcon, Center, Group, rem, Slider, Stack } from '@mantine/core';
import { IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward, IconPlayerPause } from '@tabler/icons-react';
import classes from './Footer.module.css';
import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { initSpotifyPlayer, playSpotifyTrack, extractSpotifyTrackId, SpotifyPlayer } from '../Playlist/Modal/SpotifyHandler';


interface FooterProps {
  playlist: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}


export function Footer({ playlist, currentIndex, setCurrentIndex }: FooterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [spotifyPlayer, setSpotifyPlayer] = useState<SpotifyPlayer | null>(null);
  const playerRef = useRef<ReactPlayer>(null);

  const currentSong = playlist[currentIndex] ?? null;
  const isSpotifyUrl = currentSong?.includes('spotify.com/track');


  // Initialize Spotify player
  useEffect(() => {
    // For a real app, you would get this token from your authentication flow
    // This is just a placeholder - you'll need to implement proper auth
    const initPlayer = async () => {
      try {
        // In a real app, replace this with your actual token from auth
        const token = process.env.REACT_APP_SPOTIFY_TOKEN || '';
        if (token && token.trim() !== '') {
          const player = await initSpotifyPlayer(token);
          setSpotifyPlayer(player);
          console.log('Spotify player initialized');
        } else {
          console.log('No Spotify token available, Spotify playback disabled');
        }
      } catch (error) {
        console.error('Failed to initialize Spotify player:', error);
      }
    };

    initPlayer();

    return () => {
      // Cleanup
      spotifyPlayer?.disconnect();
    };
  }, []);

  // Handle song changes
  useEffect(() => {
    if (currentSong) {
      setIsPlaying(true);
      setProgress(0);

      // If it's a Spotify URL and we have a player, play it with Spotify
      if (isSpotifyUrl && spotifyPlayer) {
        try {
          const trackId = extractSpotifyTrackId(currentSong);
          if (trackId) {
            const trackUri = `spotify:track:${trackId}`;
            playSpotifyTrack(spotifyPlayer, trackUri)
              .catch(err => {
                console.error('Error playing Spotify track:', err);
                // If there's an error with Spotify playback, we'll fall back to ReactPlayer
                console.log('Falling back to ReactPlayer for Spotify URL');
              });
          }
        } catch (error) {
          console.error('Error processing Spotify URL:', error);
        }
      }
    }
  }, [currentSong, isSpotifyUrl, spotifyPlayer]);

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (isSpotifyUrl && spotifyPlayer) {
      // If we're at the end of the playlist and using Spotify, try to use Spotify's next track
      spotifyPlayer.nextTrack().catch(err => console.error('Error skipping to next Spotify track:', err));
    }
  };

  // Track Spotify playback progress
  useEffect(() => {
    if (!isSpotifyUrl || !spotifyPlayer) return;

    const progressInterval = setInterval(() => {
      spotifyPlayer.getCurrentState().then(state => {
        if (state) {
          // Calculate progress percentage
          const progressPercent = (state.position / state.duration) * 100;
          if (!isSeeking) {
            setProgress(progressPercent);
          }

          // Handle track ended
          if (state.position >= state.duration - 300) { // 300ms before end
            handleNext();
          }
        }
      }).catch(err => console.error('Error getting Spotify state:', err));
    }, 1000); // Update every second

    return () => clearInterval(progressInterval);
  }, [isSpotifyUrl, spotifyPlayer, isSeeking, handleNext]);


  const handleSeek = (value: number) => {
    setProgress(value); // Aktualizuj stan suwaka

    if (isSpotifyUrl && spotifyPlayer) {
      // For Spotify, we need to convert percentage to milliseconds
      spotifyPlayer.getCurrentState().then(state => {
        if (state) {
          const positionMs = Math.floor(state.duration * (value / 100));
          spotifyPlayer.seek(positionMs).catch(err => console.error('Error seeking Spotify:', err));
        }
      }).catch(err => console.error('Error getting Spotify state:', err));
    } else {
      // For other players (YouTube, etc.)
      playerRef.current?.seekTo(value / 100, 'fraction'); // Seek do % pozycji
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (isSpotifyUrl && spotifyPlayer) {
      // If we're at the beginning of the playlist and using Spotify, try to use Spotify's previous track
      spotifyPlayer.previousTrack().catch(err => console.error('Error skipping to previous Spotify track:', err));
    }
  };

  return (
    <div className={classes.footer}>
      <ReactPlayer
        ref={playerRef}
        url={isSpotifyUrl && spotifyPlayer ? undefined : currentSong}
        playing={isPlaying && (!isSpotifyUrl || !spotifyPlayer)}
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
              <IconPlayerSkipBack size={24} />
            </ActionIcon>


            <ActionIcon
              size="xl"
              variant="filled"
              radius="xl"
              className={classes.playButton}
              onClick={() => {
                const newPlayingState = !isPlaying;
                setIsPlaying(newPlayingState);

                // If it's a Spotify URL and we have a player, control Spotify playback
                if (isSpotifyUrl && spotifyPlayer) {
                  if (newPlayingState) {
                    spotifyPlayer.resume().catch(err => console.error('Error resuming Spotify:', err));
                  } else {
                    spotifyPlayer.pause().catch(err => console.error('Error pausing Spotify:', err));
                  }
                }
              }}
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
