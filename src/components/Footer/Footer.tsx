import {ActionIcon, Center, Group, Slider, Stack, Text} from '@mantine/core';
import { IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward, IconPlayerPause } from '@tabler/icons-react';
import classes from './Footer.module.css';
import { useState, useRef, useEffect } from 'react'; // Dodaj useEffect
import ReactPlayer from 'react-player';
import {Song} from "../../types/Song";
import WebPlayback from "../WebPlayback/Webplayback";
import {fetchSpotifyToken} from "../../api/spotifyApi";

interface FooterProps {
  playlist: Song[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export function Footer({ playlist, currentIndex, setCurrentIndex }: FooterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [source, setSource] = useState<"youtube" | "spotify">("youtube");
  const playerRef = useRef<ReactPlayer>(null);
  const [token, setToken] = useState<string | null>(null);
  const currentSong = playlist[currentIndex] ?? null;


  useEffect(() => {
    const getToken = async () => {
      const fetchedToken = await fetchSpotifyToken();
      setToken(fetchedToken);
    };
    getToken();
  }, []);

  const handleNext = () => {

    if (currentIndex < playlist.length - 1) {


      setSource(playlist[currentIndex+1].source);

      setCurrentIndex(currentIndex + 1);

      setProgress(0);
      setIsPlaying(true);

    } else {

      setIsPlaying(false);
      setCurrentIndex(0);
      setProgress(0)
    }
  };



  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
      setIsPlaying(true); // Automatycznie odtwarzaj poprzednią piosenkę
    } else {
      // Opcjonalnie: co zrobić, gdy jesteś na pierwszej piosence i klikasz 'poprzedni'
      // Możesz np. przejść na koniec playlisty
      setCurrentIndex(playlist.length - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const handleSeek = (value: number) => {
    setProgress(value);
    // Użyj playerRef.current?.seekTo() tylko wtedy, gdy suwak jest aktywnie przeciągany
    // aby uniknąć skakania podczas aktualizacji onProgress
  };

  // Użyj useEffect do resetowania progressu i stanu odtwarzania po zmianie piosenki
  useEffect(() => {
    setProgress(0); // Zresetuj suwak, gdy currentIndex się zmieni
    // Jeśli chcesz, by piosenka zaczęła grać automatycznie po zmianie indexu, upewnij się, że isPlaying jest true
    if (currentSong && isPlaying) {
      // Możesz dodać sprawdzenie, czy player jest gotowy, jeśli napotkasz problemy z automatycznym startem
      playerRef.current?.seekTo(0, 'fraction'); // Upewnij się, że zaczyna od początku
    }
  }, [currentIndex, currentSong, isPlaying]);


  return (
      <div className={classes.footer}>

        {currentSong ? (
            source === "youtube" ? (
                <ReactPlayer
                    ref={playerRef}
                    url={currentSong.url}
                    playing={isPlaying}
                    width="0%"
                    height="0%"
                    onProgress={({ played }) => {
                      if (!isSeeking) {
                        const newProgress = played * 100;
                        setProgress(newProgress);
                        if (newProgress >= 99.5 && isPlaying) {
                          handleNext();
                        }
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={(e) => console.error('Błąd odtwarzania:', e)}
                />
            ) : source === "spotify" && token ? (
                <WebPlayback token={token} url={currentSong.url} />
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
              onMouseUp={() => {
                setIsSeeking(false);
                // Po zwolnieniu myszy, ustaw pozycję odtwarzania
                playerRef.current?.seekTo(progress / 100, 'fraction');
              }}
              onTouchStart={() => setIsSeeking(true)}
              onTouchEnd={() => {
                setIsSeeking(false);
                // Po zwolnieniu palca, ustaw pozycję odtwarzania
                playerRef.current?.seekTo(progress / 100, 'fraction');
              }}
              color="white"
              size="sm"
              radius="xl"
              className={classes.slider}
          />
        </Stack>
      </div>
  );
}