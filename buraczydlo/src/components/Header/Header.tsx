import { useState } from 'react';
import { TextInput, Burger, Container, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import classes from './Header.module.css';

const links = [
    { link: '/learn', label: 'Playlists' },
    { link: '/about', label: 'Spotify' },
    { link: '/pricing', label: 'Youtube' },

];

export function Header() {
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);

    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={classes.link}
            data-active={active === link.link || undefined}
            onClick={(event) => {
                event.preventDefault();
                setActive(link.link);
            }}
        >
            {link.label}
        </a>
    ));

    return (
        <header className={classes.header}>
            <Container size="md" className={classes.inner}>

                <Group gap={5} >
                    {items}

                    
                </Group>
                <TextInput

placeholder="Wprowadz link"
/>
               
            </Container>
        </header>
    );
}