import React from 'react';
import './App.css';
import { CommonLayout } from './Layouts';
import {Header} from '../src/components/Header/Header'
import { Box, MantineProvider, Title } from '@mantine/core';

function App() {
  return (
<CommonLayout>
  <Box>
    <Title>Eluwinka</Title>
  </Box>
</CommonLayout>
  )
}

export default App;
