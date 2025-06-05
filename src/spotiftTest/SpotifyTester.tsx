import { useEffect, useState } from 'react';
import { Button, Text, Stack } from '@mantine/core';
import { fetchSpotifyToken } from '../services/spotifyService';
import WebPlayback from "../components/WebPlayback/Webplayback";


export default function SpotifyTester() {
    const [token, setToken] = useState<string | null>(null);
const url="https://open.spotify.com/track/2WfaOiMkCvy7F5fcp2zZ8L?si=dcaa9b1b60804d77"

    useEffect(() => {
        const getToken = async () => {
            const fetchedToken = await fetchSpotifyToken();
                     setToken(fetchedToken);
        };
        getToken();
    }, []);

    return (
        <div style={{ padding: 32 }}>
            <Text size="xl" mb="lg">Spotify Web Playback SDK Tester</Text>
            {!token && <Text>Ładowanie tokena...</Text>}

            {token && (
                <Stack>
                    <Text>Player ready</Text>
                    <Button>▶ Odtwórz utwór</Button>
                    <Button>⏸ Pauza</Button>
                    <Button>⏵ Wznów</Button>
                    <Button>⏮ Poprzedni</Button>
                    <Button>⏭ Następny</Button>


                    {/*<WebPlayback token={token} url={url} />*/}
                </Stack>
            )}
        </div>
    );
}
