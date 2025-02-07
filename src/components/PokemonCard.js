import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { CardCor } from "../utils/CardCor.js";
import { DistintivoCor } from "../utils/DistintivoCor.js";
import styles from "../styles/CardStyles.js";
import ImagensIcon from "../utils/Imagens.js";

// Componente para exibir o card de um Pokémon
const PokemonCard = ({ item, onSelect }) => {
  const [details, setDetails] = useState(null);

  // Busca os detalhes do Pokémon ao carregar
  useEffect(() => {
    axios
      .get(item.url)
      .then((res) => setDetails(res.data))
      .catch(console.error);
  }, [item.url]);

  // Exibe mensagem de carregamento enquanto os detalhes não estão disponíveis
  if (!details) return <Text>Loading...</Text>;

  // Obtém o ícone do tipo do Pokémon
  const IconCor = (type) => ImagensIcon.elementos[type] || null;

  return (
    <TouchableOpacity
      onPress={() => onSelect(details)}
      style={[
        styles.card,
        { backgroundColor: CardCor(details.types[0].type.name) },
      ]}
    >
      <Image source={ImagensIcon.icons.pattern1} style={styles.pattern} />
      <Image source={ImagensIcon.icons.clearBall} style={styles.pokeball} />
      <View style={styles.leftSide}>
        <Text style={styles.idText}>
          #{details.id.toString().padStart(3, "0")}
        </Text>
        <Text style={styles.nameText} numberOfLines={1}>
          {details.name.charAt(0).toUpperCase() + details.name.slice(1)}
        </Text>
        <View style={styles.typeContainer}>
          {details.types.map((typeInfo) => (
            <View
              key={typeInfo.type.name}
              style={[
                styles.typeBadge,
                { backgroundColor: DistintivoCor(typeInfo.type.name) },
              ]}
            >
              <Image
                source={IconCor(typeInfo.type.name)}
                style={styles.typeIcon}
              />
              <Text style={styles.typeText}>
                {typeInfo.type.name.charAt(0).toUpperCase() +
                  typeInfo.type.name.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.rightSide}>
        <Image
          source={{ uri: details.sprites.front_default }}
          style={styles.pokemonImg}
        />
      </View>
    </TouchableOpacity>
  );
};

export default PokemonCard;
