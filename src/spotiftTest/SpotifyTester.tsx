import { useEffect, useState } from 'react';
import { Button, Text, Stack } from '@mantine/core';
import { fetchSpotifyToken } from '../api/spotifyApi';
import WebPlayback from "../components/WebPlayback/Webplayback";


export default function SpotifyTester() {
    const [token, setToken] = useState<string | null>(null);
const url="https://open.spotify.com/track/5Rq31wesx2Y0BxOuXSdGa3?si=25fd0b6a4554409d"

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

                    {/* Tu wstawiamy WebPlayback */}
                    <WebPlayback token={token} url={url} />
                </Stack>
            )}
        </div>
    );
}
