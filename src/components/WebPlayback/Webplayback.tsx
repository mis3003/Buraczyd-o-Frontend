import React, { useState, useEffect } from 'react';


type WebPlaybackProps = {
    token: string;
    url: string;
};

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
};

function WebPlayback({ token, url }: WebPlaybackProps)  {
    const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
    const [is_paused, setPaused] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [deviceId, setDeviceId] = useState<string | null>(null);

    const playTrack = async (trackUri: string) => {
        if (!deviceId) {
            console.warn("Device ID jeszcze nie jest dostępny");
            return;
        }
        try {
            const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: 'PUT',
                body: JSON.stringify({ uris: [trackUri] }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                console.error("Błąd odtwarzania:", await response.text());
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });
console.log(deviceId);
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => {
                if (!state) return;

                setTrack(state.track_window.current_track);
                setPaused(state.paused);
            }));

            player.connect().then(success => {
                console.log("Połączono z odtwarzaczem:", success); // 👈 sprawdzamy to!
            });
        };
    }, [token]);

    if (!player) {
        return <div>Ładowanie odtwarzacza...</div>;
    }

    return (
        <div className="container">
            <div className="main-wrapper">

                <button onClick={() => playTrack(url)}>Zagraj utwór</button>



                <div className="now-playing__side">
                    <div className="now-playing__name">
                        {current_track.name}
                    </div>

                    <div className="now-playing__artist">
                        {current_track.artists[0].name}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WebPlayback;
