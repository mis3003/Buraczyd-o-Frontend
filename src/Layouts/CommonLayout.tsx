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
    const [currentSongUrl, setCurrentSongUrl] = useState<string | null>(null);
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
            <Playlist selected={selectedPlaylist} onSongSelect={setCurrentSongUrl} />

            </AppShell.Main>
            <AppShell.Footer>
            <Footer songUrl={currentSongUrl} />
            </AppShell.Footer>



        </AppShell>
    );
};