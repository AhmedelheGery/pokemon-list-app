import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Box,
  Alert,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import { Link } from 'react-router-dom';

interface Pokemon {
  name: string;
  url: string;
  id: number;
  sprite: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

const PokemonLoadMorePage: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(
    'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
  );

  const fetchPokemon = async (url: string) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PokemonListResponse = await response.json();

      const newPokemon: Pokemon[] = data.results.map((p) => {
        const idMatch = p.url.match(/\/(\d+)\/$/);
        const id = idMatch ? parseInt(idMatch[1], 10) : 0;
        return {
          ...p,
          id: id,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });

      setPokemonList((prevList) => [...prevList, ...newPokemon]);
      setNextUrl(data.next);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nextUrl) {
      fetchPokemon(nextUrl);
    }
  }, []);

  const handleLoadMore = () => {
    if (nextUrl) {
      fetchPokemon(nextUrl);
    }
  };

  const handleRetry = () => {
    if (nextUrl) {
      fetchPokemon(nextUrl);
    } else {
      setNextUrl('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
      fetchPokemon('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load Pokémon: {error}
          <Button onClick={handleRetry} sx={{ ml: 2 }} variant="outlined">
            Retry
          </Button>
        </Alert>
      )}

      <Grid container spacing={3}>
        {pokemonList.map((pokemon) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pokemon.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, objectFit: 'contain', margin: 'auto' }}
                image={pokemon.sprite}
                alt={pokemon.name}
              />
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography gutterBottom variant="h6" component="div">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </Typography>
                <Link to={`/pokemon/${pokemon.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" size="small">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && nextUrl && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <Button variant="contained" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}

      {!loading && !nextUrl && pokemonList.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <Typography variant="body1" color="text.secondary">
            You've seen all Pokémon!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default PokemonLoadMorePage;
