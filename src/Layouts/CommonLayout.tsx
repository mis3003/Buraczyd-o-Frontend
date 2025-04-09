import { AppShell } from "@mantine/core";
import React from 'react';
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { useState } from 'react';
import { Playlist } from "../components/Playlist/Playlist";
import App from "../App";

export const CommonLayout = ({ children }: any) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState('Playlista 1');
    const [playingPlaylist, setPlayingPlaylist] = useState('Playlista 1'); 
    const [currentSongUrl, setCurrentSongUrl] = useState<string | null>(null);
    const [playlist, setPlaylist] = useState<string[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);



    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 250, breakpoint: 'sm' }} // Dodany breakpoint
        >

            <AppShell.Header>
                <Header />
            </AppShell.Header>
            <AppShell.Navbar>
                <Sidebar onSelect={setSelectedPlaylist} />
            </AppShell.Navbar>

            <AppShell.Main style={{ paddingLeft: 300 }}>
            <Playlist
  selected={selectedPlaylist}
  onSongSelect={(url) => {
    setCurrentSongUrl(url);
    const index = playlist.indexOf(url);
    if (index !== -1) setCurrentIndex(index);
  }}
  setPlaylist={setPlaylist}
/>
            </AppShell.Main>
            <AppShell.Footer>
                <Footer
                    playlist={playlist}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                />
            </AppShell.Footer>



        </AppShell>
    );
};