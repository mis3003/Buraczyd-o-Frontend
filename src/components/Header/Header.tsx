import { useState } from 'react';
import { TextInput, Burger, Container, Group, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useLocation } from 'react-router-dom';

import classes from './Header.module.css';

const links = [
    { link: '/Playlist', label: 'Playlists' },
];

export function Header() {
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const navigate = useNavigate();
    const location = useLocation();

    // const items = links.map((link) => (
    //     <a
    //         key={link.label}
    //         href={link.link}
    //         className={classes.link}
    //         data-active={active === link.link || undefined}
    //         onClick={(event) => {
    //             event.preventDefault();
    //             setActive(link.link);
    //             navigate(`/app${link.link.toLowerCase()}`);
    //         }}
    //     >
    //         {link.label}
    //     </a>
    // ));

    return (
        <header className={classes.header}>
            <Container size="md" className={classes.inner}>

                <Group gap={5} >

                    <Button
                        className={classes.link}
                        data-active={active === '/Spotify' || undefined}
                        onClick={async () => {
                            try {
                                // Wysyłanie żądania do backendu
                                const response =await fetch("http://localhost:8080/api/spotify/authorize", {
                                    method: "GET",
                                    credentials: "include"
                                });
                                if (response.ok) {
                                    console.log(response);
                                    // Przekierowanie użytkownika do Spotify
                                    const redirectUrl = await response.text();
                                    window.location.href = redirectUrl;
                                } else {
                                    console.error('Błąd podczas autoryzacji');
                                }
                            } catch (error) {
                                console.error('Problem z połączeniem', error);
                            }
                        }}
                    >


                       Zaloguj do Spotify
                    </Button>
                </Group>
                <Group gap={10}>
                    <TextInput
                        placeholder="Wprowadz link"
                    />
                    {/*<Button */}
                    {/*    style={{ backgroundColor: '#730029' }}*/}
                    {/*    onClick={() => navigate('/login')}*/}
                    {/*>*/}
                    {/*    Login*/}
                    {/*</Button>*/}
                    {/*<Button */}
                    {/*    variant="outline"*/}
                    {/*    style={{ borderColor: '#730029', color: '#730029' }}*/}
                    {/*    onClick={() => navigate('/register')}*/}
                    {/*>*/}
                    {/*    Register*/}
                    {/*</Button>*/}
                </Group>

            </Container>
        </header>
    );
}
