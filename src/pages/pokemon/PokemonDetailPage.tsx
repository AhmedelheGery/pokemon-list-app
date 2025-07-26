import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography,
  Container,
  CircularProgress,
  Box,
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatHeight, formatWeight } from '../../utils/helper';

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  base_experience: number;
}

const PokemonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!id) {
        setError('Err happend while fetching details');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PokemonDetail = await response.json();
        setPokemon(data);
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

    fetchPokemonDetails();
  }, [id]);

  const fetchPokemonDetails = async () => {
    if (!id) {
      setError('Pokémon ID not found in URL.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PokemonDetail = await response.json();
      setPokemon(data);
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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading Pokémon details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
          <Button onClick={fetchPokemonDetails} sx={{ ml: 2 }} variant="outlined">
            Retry
          </Button>
        </Alert>
        <Button component={Link} to="/" variant="outlined" startIcon={<ArrowBackIcon />}>
          Back to List
        </Button>
      </Container>
    );
  }

  if (!pokemon) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5">Pokémon not found.</Typography>
        <Button component={Link} to="/" variant="outlined" startIcon={<ArrowBackIcon />}>
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        component={Link}
        to="/"
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to List
      </Button>

      <Card
        sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 3, boxShadow: 3 }}
      >
        <Box
          sx={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pr: { sm: 3 },
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 200, height: 200, objectFit: 'contain', mb: 2 }}
            image={
              pokemon.sprites.other?.['official-artwork'].front_default ||
              pokemon.sprites.front_default
            }
            alt={pokemon.name}
          />
          <Typography variant="h5" component="h2" gutterBottom>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} #
            {String(pokemon.id).padStart(3, '0')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {pokemon.types.map((typeInfo) => (
              <Chip
                key={typeInfo.type.name}
                label={typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}
                color="primary"
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">
                Height
              </Typography>
              <Typography variant="h6">{formatHeight(pokemon.height)}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" color="text.secondary">
                Weight
              </Typography>
              <Typography variant="h6">{formatWeight(pokemon.weight)}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
        <Divider
          orientation="horizontal"
          flexItem
          sx={{ display: { xs: 'block', sm: 'none' }, my: 2 }}
        />

        <CardContent sx={{ flex: '1 1 auto', width: { xs: '100%', sm: 'auto' } }}>
          <Typography variant="h6" gutterBottom>
            Base Stats
          </Typography>
          {pokemon.stats.map((statInfo) => (
            <Box key={statInfo.stat.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ width: 80, textTransform: 'capitalize' }}>
                {statInfo.stat.name.replace('-', ' ')}:
              </Typography>
              <Typography variant="body1" sx={{ minWidth: 40 }}>
                {statInfo.base_stat}
              </Typography>
              <Box sx={{ flexGrow: 1, ml: 1, bgcolor: '#eee', borderRadius: 1 }}>
                <Box
                  sx={{
                    width: `${Math.min(statInfo.base_stat / 1.5, 100)}%`,
                    height: 8,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Box>
          ))}

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Abilities
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {pokemon.abilities.map((abilityInfo) => (
              <Chip
                key={abilityInfo.ability.name}
                label={
                  `${abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1)}` +
                  (abilityInfo.is_hidden ? ' (hidden)' : '')
                }
                variant="outlined"
              />
            ))}
          </Box>

          <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
            Base Experience
          </Typography>
          <Typography variant="body1">{pokemon.base_experience} XP</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PokemonDetailPage;
