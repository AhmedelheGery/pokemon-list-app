import { Typography, Container, Box, Tabs, Tab } from '@mui/material';
import React, { useState } from 'react';
import PokemonLoadMorePage from './sections/PokemonLoadMorePage';
import PokemonPaginatedList from './sections/PokemonPaginatedList';
import TabPanel from '../../component/tab-panel';

const PokemonListPage: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography sx={{ fontSize: '1.5rem', textAlign: 'center', mb: 2 }}>Pokemon</Typography>
      <Typography sx={{ fontSize: '1rem', textAlign: 'center', mb: 2 }}>
        Discover and exploar Pokemon with page controls
      </Typography>

      <Box
        sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="pokemon list view tabs"
          sx={{
            '& .Mui-selected': {
              bgcolor: '#000',
              color: '#fff',
              border: 0,
              outline: 'none',
            },
          }}
        >
          <Tab label="Page Control" />
          <Tab label="Infinite Scroll" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <PokemonPaginatedList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PokemonLoadMorePage />
      </TabPanel>
    </Container>
  );
};

export default PokemonListPage;
