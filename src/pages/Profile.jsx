import React from 'react';
import PokemonProfile from "../components/PokemonProfile";

const Profile = ({ pokemon, onBack }) => {
  return (
    <PokemonProfile pokemon={pokemon} onBack={onBack} />
  );
};

export default Profile;