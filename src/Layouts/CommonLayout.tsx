import React, { useState } from 'react';
import { AppShell } from '@mantine/core';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Playlist as PlaylistComponent } from '../components/Playlist/Playlist';
import { Playlist } from '../types/Playlist';
import { Song, CreateSongRequest } from '../types/Song';

export const CommonLayout = ({ children }: any) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [playingPlaylist, setPlayingPlaylist] = useState<Playlist | null>(null);
    const [playlistData, setPlaylistData] = useState<{ [playlistId: number]: Song[] }>({});

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSongSelect = (playlist: Playlist, url: string, index: number) => {
        setPlayingPlaylist(playlist);
        setCurrentIndex(index);
    };

    const handleAddSong = (songRequest: CreateSongRequest) => {
        if (!selectedPlaylist) return;

        const newSong: Song = {
            ...songRequest,
            id: Date.now(), // tymczasowe ID
            playlistId: selectedPlaylist.id,
        };

        setPlaylistData((prev) => ({
            ...prev,
            [selectedPlaylist.id]: [...(prev[selectedPlaylist.id] || []), newSong],
        }));
    };

    return (
        <AppShell header={{ height: 60 }} navbar={{ width: 250, breakpoint: 'sm' }}>
            <AppShell.Header>
                <Header />
            </AppShell.Header>

            <AppShell.Navbar>
                <Sidebar onSelect={setSelectedPlaylist} />
            </AppShell.Navbar>

            <AppShell.Main style={{ paddingLeft: 300 }}>
                {selectedPlaylist && (
                    <PlaylistComponent
                        id={selectedPlaylist.id}
                        selected={selectedPlaylist.name}
                        songs={playlistData[selectedPlaylist.id] || []}
                        onAddSong={handleAddSong}
                        onSongSelect={(url, index) => handleSongSelect(selectedPlaylist, url, index)}
                    />
                )}
            </AppShell.Main>

            <AppShell.Footer>
                <Footer
                    playlist={(playingPlaylist ? playlistData[playingPlaylist.id] : []) || []}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                />
            </AppShell.Footer>
        </AppShell>
    );
};
