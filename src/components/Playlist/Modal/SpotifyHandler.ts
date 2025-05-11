import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { SpotifyPlayer } from '../../../types/spotify-web-playback-sdk';

// Export SpotifyPlayer type for use in other components
export type { SpotifyPlayer };

// Initialize the Spotify API SDK
let spotifyApi: SpotifyApi | null;
try {
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '';
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || '';

  if (clientId && clientSecret) {
    spotifyApi = SpotifyApi.withClientCredentials(clientId, clientSecret);
  } else {
    console.warn('Spotify API credentials not found. Some Spotify features will be disabled.');
    spotifyApi = null;
  }
} catch (error) {
  console.error('Failed to initialize Spotify API:', error);
  spotifyApi = null;
}

// For user authentication (needed for playback)
let userToken: string | null = null;

// Function to extract Spotify track ID from URL
export function extractSpotifyTrackId(url: string): string | null {
  const regex = /track\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Function to fetch track info from Spotify
export async function fetchSpotifyTrackInfo(url: string): Promise<{ title: string; artistName: string } | null> {
  try {
    if (!spotifyApi) {
      console.warn('Spotify API not initialized. Cannot fetch track info.');
      return null;
    }

    const trackId = extractSpotifyTrackId(url);
    if (!trackId) return null;

    const track = await spotifyApi.tracks.get(trackId);
    return {
      title: track.name,
      artistName: track.artists.map((artist: { name: string; uri: string }) => artist.name).join(', ')
    };
  } catch (error) {
    console.error('Error fetching Spotify track:', error);
    return null;
  }
}

// Function to get track title (similar to YouTube handler)
export async function fetchSpotifyTitle(url: string): Promise<string> {
  try {
    const trackInfo = await fetchSpotifyTrackInfo(url);
    if (!trackInfo) return 'Unknown Track';
    return `${trackInfo.title} - ${trackInfo.artistName}`;
  } catch (error) {
    console.error('Error fetching Spotify title:', error);
    return 'Unknown Track';
  }
}

// Initialize Spotify Web Playback SDK
export function initSpotifyPlayer(token: string): Promise<SpotifyPlayer> {
  return new Promise((resolve, reject) => {
    if (!token || token.trim() === '') {
      reject(new Error('No Spotify token provided'));
      return;
    }

    userToken = token;

    // Check if Spotify SDK is loaded
    if (!window.Spotify) {
      console.error('Spotify SDK not loaded. Make sure the script is included in your HTML.');
      reject(new Error('Spotify SDK not loaded'));
      return;
    }

    try {
      // If SDK is already ready, initialize player immediately
      if (window.Spotify.Player) {
        initializePlayer();
      } else {
        // Otherwise wait for SDK to be ready
        // Store the original onSpotifyWebPlaybackSDKReady function if it exists
        const originalCallback = window.onSpotifyWebPlaybackSDKReady;

        // Replace it with a function that calls both the original callback and our initialization
        window.onSpotifyWebPlaybackSDKReady = function() {
          if (typeof originalCallback === 'function') {
            originalCallback();
          }
          initializePlayer();
        };
      }
    } catch (error) {
      console.error('Error initializing Spotify player:', error);
      reject(error);
    }

    function initializePlayer() {
      try {
        // Add data attribute to Spotify player iframe when it's created
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'IFRAME') {
                  const iframeElement = node as HTMLIFrameElement;
                  if (iframeElement.src?.includes('spotify') || iframeElement.src?.includes('scdn.co')) {
                    iframeElement.setAttribute('data-spotify-player', 'true');
                  }
                }
              });
            }
          });
        });

        // Start observing the document body for added nodes
        observer.observe(document.body, { childList: true, subtree: true });

        // Clean up observer when player is disconnected
        const originalDisconnect = window.Spotify.Player.prototype.disconnect;
        window.Spotify.Player.prototype.disconnect = function() {
          observer.disconnect();
          return originalDisconnect.apply(this, arguments);
        };

        const player = new window.Spotify.Player({
          name: 'Buraczydlo Web Player',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => {
          console.error('Initialization error:', message);
          reject(new Error(message));
        });

        player.addListener('authentication_error', ({ message }) => {
          console.error('Authentication error:', message);
          reject(new Error(message));
        });

        player.addListener('account_error', ({ message }) => {
          console.error('Account error:', message);
          reject(new Error(message));
        });

        player.addListener('playback_error', ({ message }) => {
          console.error('Playback error:', message);
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
          console.log('Spotify Player Ready with Device ID:', device_id);
          resolve(player);
        });

        // Connect to the player
        player.connect();
      } catch (error) {
        console.error('Error creating Spotify player:', error);
        reject(error);
      }
    }
  });
}

// Play a Spotify track
export async function playSpotifyTrack(player: SpotifyPlayer, trackUri: string): Promise<void> {
  try {
    if (!player) {
      console.error('Spotify player not initialized');
      throw new Error('Spotify player not initialized');
    }

    if (!userToken) {
      console.error('User token not available');
      throw new Error('User token not available');
    }

    // Get the device ID
    const state = await player.getCurrentState();
    if (!state) {
      console.error('Player not connected or no active device');
      throw new Error('Player not connected or no active device');
    }

    // Use the Spotify API to start playback on the device
    const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: [trackUri]
      })
    });

    if (!response.ok) {
      // If response is not 2xx, parse error message
      const errorText = await response.text();
      console.error(`Error playing track: ${response.status} - ${errorText}`);
      throw new Error(`Failed to play track: ${response.status}`);
    }
  } catch (error) {
    console.error('Error in playSpotifyTrack:', error);
    throw error; // Re-throw to allow caller to handle
  }
}
