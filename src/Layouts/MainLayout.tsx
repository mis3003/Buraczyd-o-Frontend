import { AppShell } from "@mantine/core";
import React from 'react';
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

interface Song {
  name: string;
  url: string;
}

export const MainLayout = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingPlaylist, setPlayingPlaylist] = useState('Playlista 1');

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 250, breakpoint: 'sm' }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar onSelect={setPlayingPlaylist} />
      </AppShell.Navbar>

      <AppShell.Main style={{ paddingLeft: 300 }}>
        <Outlet />
      </AppShell.Main>

      <AppShell.Footer>
        <Footer
          playlist={[]}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </AppShell.Footer>
    </AppShell>
  );
};