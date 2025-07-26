import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PokemonListPage from '../pages/pokemon/PokemonListPage';
import PokemonDetailPage from '../pages/pokemon/PokemonDetailPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PokemonListPage />} />
      <Route path="/pokemon/:id" element={<PokemonDetailPage />} />

      <Route
        path="*"
        element={
          <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              404 - Page Not Found
            </Typography>
            <Button variant="contained" component={Link} to="/">
              Go Home
            </Button>
          </Container>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
