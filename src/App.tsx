import React from 'react';
import { CommonLayout } from './Layouts';
import { MantineProvider } from '@mantine/core';

function App() {
  return <MantineProvider>
    <CommonLayout>
      Hej
    </CommonLayout>
  </MantineProvider>;
}

export default App;
