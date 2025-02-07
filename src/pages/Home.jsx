import React from 'react';
import PokemonHome from "../components/PokemonHome";

const Home = ({ pokemon, onBack }) => {
  return (
    <PokemonHome pokemon={pokemon} onBack={onBack} />
  );
};

export default Home;