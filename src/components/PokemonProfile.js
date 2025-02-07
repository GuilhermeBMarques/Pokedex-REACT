import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import styles from "../styles/ProfileStyles.js";
import { bgCor } from "../utils/bgCor";
import { CardCor } from "../utils/CardCor";
import { DistintivoCor } from "../utils/DistintivoCor";
import ImagensIcon from "../utils/Imagens.js";
import { TextCor } from "../utils/TextCor";

const PokemonProfile = ({ pokemon, onBack }) => {
  const [activeModal, setActiveModal] = useState("about");
  const [genus, setGenus] = useState("");
  const height = pokemon.height / 10;
  let pes = Math.floor(height * 3.28084);
  let polegadas_restantes = Math.round((height * 3.28084 - pes) * 12);

  if (polegadas_restantes >= 12) {
    polegadas_restantes = 0;
    pes += 1;
  }

  const weight = pokemon.weight / 10;
  const lbs = weight * 2.20462;
  const [weaknesses, setWeaknesses] = useState({});
  const [specialAttackEffort, setSpecialAttackEffort] = useState(null);
  const xp = pokemon.base_experience;
  const [gender, setGender] = useState({ male: 0, female: 0 });
  const [eggGroups, setEggGroups] = useState([]);
  const [eggCycles, setEggCycles] = useState(null);
  const [hatchSteps, setHatchSteps] = useState("");
  const [stats, setStats] = useState([]);
  const [evolutions, setEvolutions] = useState([]);

  // Função para abrir o modal correspondente
  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  // Função para renderizar os botões de navegação dos modais
  const renderModal = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.btn} onPress={() => openModal("about")}>
        <Text style={styles.btnText}>About</Text>
        <Image
          source={ImagensIcon.icons.clearBall}
          style={
            activeModal === "about"
              ? styles.pokeballIcon
              : styles.hiddenPokeball
          }
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => openModal("stats")}>
        <Text style={styles.btnText}>Stats</Text>
        <Image
          source={ImagensIcon.icons.clearBall}
          style={
            activeModal === "stats"
              ? styles.pokeballIcon
              : styles.hiddenPokeball
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => openModal("evolution")}
      >
        <Text style={styles.btnText}>Evolution</Text>
        <Image
          source={ImagensIcon.icons.clearBall}
          style={
            activeModal === "evolution"
              ? styles.pokeballIcon
              : styles.hiddenPokeball
          }
        />
      </TouchableOpacity>
    </View>
  );

  // Função para renderizar a barra de stats do Pokémon
  const renderStat = (statName) => {
    return stats
      .filter((stat) => stat.name === statName)
      .map((stat, index) => {
        const [normal, min, max] = calculateStat(stat.base, stat.name);
        const barWidth = (normal / max) * 200;

        return (
          <View key={index} style={styles.containerStatBar}>
            <Text style={styles.infoText2}>
              {`${normal.toString().padStart(3, "0")}`}
              {"         "}
            </Text>
            <View style={styles.statBar}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${barWidth}%` },
                  {
                    backgroundColor: CardCor(pokemon.types[0].type.name),
                  },
                ]}
              />
            </View>
            <Text style={styles.infoText2}>
              {"       "}
              {`${min.toString().padStart(3, "0")}`} {"        "}
              {`${max.toString().padStart(3, "0")}`}
            </Text>
          </View>
        );
      });
  };

  // Função para calcular a faixa de valores de stats
  const calculateStat = (baseStat, statName) => {
    const normal = {
      hp: baseStat,
      attack: baseStat,
      defense: baseStat,
      "special-attack": baseStat,
      "special-defense": baseStat,
      speed: baseStat,
    };

    const min = {
      hp: baseStat + 155,
      attack: baseStat + 43,
      defense: baseStat + 43,
      "special-attack": baseStat + 56,
      "special-defense": baseStat + 56,
      speed: baseStat + 40,
    };

    const max = {
      hp: baseStat + 249,
      attack: baseStat + 167,
      defense: baseStat + 167,
      "special-attack": baseStat + 186,
      "special-defense": baseStat + 186,
      speed: baseStat + 162,
    };
    return [normal[statName], min[statName], max[statName]];
  };

  // Função para calcular o total de stats
  const calculateTotal = () => {
    return stats.reduce((total, stat) => total + stat.base, 0);
  };

  // Efeito colateral para buscar dados do Pokémon ao ser renderizado
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!pokemon) {
          console.warn("Pokemon is not defined.");
          return;
        }

        // Busca informações sobre a espécie do Pokémon
        const response = await fetch(pokemon.species.url);
        const speciesData = await response.json();

        const genusEntry = speciesData.genera.find(
          (entry) => entry.language.name === "en"
        );

        if (genusEntry) {
          setGenus(genusEntry.genus);
        } else {
          console.warn("Genus entry not found.");
        }

        // Busca o valor do effort para special-attack
        const specialAttackStat = pokemon.stats.find(
          (stat) => stat.stat.name === "special-attack"
        );
        if (specialAttackStat) {
          setSpecialAttackEffort(specialAttackStat.effort);
        }

        // Busca informações sobre o gênero, grupos de ovos e ciclos de ovos
        const genderMale =
          speciesData.gender_rate >= 0
            ? (speciesData.gender_rate / 8) * 100
            : 0;
        const genderFemale = 100 - genderMale;
        setGender({ male: genderMale, female: genderFemale });
        setEggGroups(speciesData.egg_groups.map((group) => group.name));
        setEggCycles(speciesData.hatch_counter);

        // Calcula o número de passos de eclosão
        const hatchCounter = speciesData.hatch_counter;
        const stepsMin = hatchCounter * 245 - 16;
        const stepsMax = (hatchCounter + 1) * 245 - 5;
        setHatchSteps(
          `${stepsMin.toLocaleString()} - ${stepsMax.toLocaleString()} steps`
        );

        // Busca as evoluções do Pokémon
        const evolutionPokemonImages = await fetchEvolutions(
          pokemon.species.url
        );
        setEvolutions(evolutionPokemonImages);

        // Busca os stats do Pokémon
        const statsData = pokemon.stats.map((stat) => ({
          name: stat.stat.name,
          base: stat.base_stat,
        }));
        setStats(statsData);

        // Busca os tipos do Pokémon
        const typeUrls = pokemon.types.map((typeInfo) => typeInfo.type.url);

        // Busca as informações dos tipos
        const typeDataPromises = typeUrls.map((url) =>
          fetch(url).then((res) => res.json())
        );
        const typesData = await Promise.all(typeDataPromises);

        // Inicializa um mapa para calcular multiplicadores de fraquezas
        const damageMultipliers = {};

        // Função para aplicar multiplicadores de fraquezas
        const applyMultiplier = (typeList, multiplier) => {
          typeList.forEach((type) => {
            if (!damageMultipliers[type.name]) {
              damageMultipliers[type.name] = 1;
            }
            damageMultipliers[type.name] *= multiplier;
          });
        };

        // Processa as relações de dano para cada tipo
        typesData.forEach((typeData) => {
          applyMultiplier(typeData.damage_relations.double_damage_from, 2);
          applyMultiplier(typeData.damage_relations.half_damage_from, 0.5);
          applyMultiplier(typeData.damage_relations.no_damage_from, 0);
        });

        // Filtra as fraquezas com base nos valores dos multiplicadores
        const weaknesses = Object.entries(damageMultipliers)
          .filter(([, multiplier]) => multiplier > 1)
          .map(([type]) => type);

        // Atualiza o estado com as fraquezas calculadas
        setWeaknesses({ double_damage_from: weaknesses });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        console.log("Fetch attempt complete.");
      }
    };

    fetchData();
  }, [pokemon]);

  // Efeito colateral para buscar dados do Pokémon ao ser renderizado
  const fetchEvolutions = async (speciesUrl) => {
    try {
      const speciesResponse = await fetch(speciesUrl);
      const speciesData = await speciesResponse.json();

      const evolutionChainUrl = speciesData.evolution_chain.url;
      const evolutionResponse = await fetch(evolutionChainUrl);
      const evolutionData = await evolutionResponse.json();

      const evolutions = [];
      let currentEvolution = evolutionData.chain;

      // Percorre a cadeia de evolução
      while (currentEvolution) {
        const pokemonName = currentEvolution.species.name;
        const pokemonResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        const pokemonData = await pokemonResponse.json();

        evolutions.push({
          name: pokemonName,
          image: pokemonData.sprites.other["official-artwork"].front_default,
          id: pokemonData.id,
        });

        currentEvolution = currentEvolution.evolves_to[0];
      }

      return evolutions;
    } catch (error) {
      console.error("Error fetching evolutions:", error);
      return [];
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: CardCor(pokemon.types[0].type.name) },
      ]}
    >
      <View style={styles.pokemonContainer}>
        <View style={styles.leftSide}>
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={styles.pokemonImg}
          />
          <Image source={ImagensIcon.icons.circulo} style={styles.circleIcon} />
        </View>

        <View style={styles.rightSide}>
          <Text style={styles.pokemonIdText}>
            #{pokemon.id.toString().padStart(3, "0")}
          </Text>

          <Text style={styles.pokemonNameText}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>
          <View style={styles.typeContainer}>
            {pokemon.types.map((typeInfo) => (
              <View
                key={typeInfo.type.name}
                style={[
                  styles.typeBadge,
                  { backgroundColor: DistintivoCor(typeInfo.type.name) },
                ]}
              >
                <Image
                  source={bgCor(typeInfo.type.name)}
                  style={styles.typeIcon}
                />
                <Text style={styles.typeText}>{typeInfo.type.name}</Text>
              </View>
            ))}
          </View>
          <Image
            source={ImagensIcon.icons.pattern2}
            style={styles.secondaryIcon}
          />
        </View>
      </View>

      {/* Modal About */}
      <Modal
        visible={activeModal === "about"}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={onBack}>
            <Image source={ImagensIcon.icons.exit} style={styles.closeButton} />
          </TouchableOpacity>
        </View>
        {renderModal()}
        <View style={[styles.descriptionContainer, { flex: 1 }]}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* Pokédex Data */}
            <Text
              style={[
                styles.greenText,
                { color: TextCor(pokemon.types[0].type.name) },
              ]}
            >
              Pokédex Data
            </Text>

            {/* Species */}
            <Text style={styles.infoText1}>
              Species{"                   "}
              <Text style={styles.infoText2}>{genus}</Text>
            </Text>

            {/* Height */}
            <Text style={styles.infoText1}>
              Height{"                      "}
              <Text style={styles.infoText2}>
                {height}m{" "}
                <Text style={styles.smallText}>
                  ({pes}′{polegadas_restantes.toString().padStart(2, "0")}″){" "}
                </Text>
              </Text>
            </Text>

            {/* Weight */}
            <Text style={styles.infoText1}>
              Weight{"                     "}
              <Text style={styles.infoText2}>
                {weight}kg{" "}
                <Text style={styles.smallText}>({lbs.toFixed(1)} lbs)</Text>
              </Text>
            </Text>

            {/* Abilities */}
            <View style={styles.inlineContainer}>
              <Text style={styles.infoText1}>
                Abilities{"                   "}
                <Text style={styles.infoText2}>1.</Text>
              </Text>
              <View style={styles.abilitiesContainer}>
                {pokemon.abilities.map((ability, index) => (
                  <Text key={ability.ability.name} style={styles.infoText2}>
                    {`${
                      ability.ability.name.charAt(0).toUpperCase() +
                      ability.ability.name.slice(1)
                    }${ability.is_hidden ? " (hidden ability)" : ""}`}
                    {index === 0 && <Text>{", "}</Text>}
                  </Text>
                ))}
              </View>
            </View>

            {/* Weaknesses */}
            <View style={[styles.inlineContainer, { alignItems: "center" }]}>
              <Text style={styles.infoText1}>Weaknesses{"        "}</Text>

              {weaknesses.double_damage_from &&
              weaknesses.double_damage_from.length > 0 ? (
                weaknesses.double_damage_from.map((weakness, index) => (
                  <View style={[{ marginLeft: 10 }]} key={index}>
                    <View
                      style={[
                        styles.weaknessType,
                        { backgroundColor: DistintivoCor(weakness) },
                      ]}
                    >
                      <Image
                        source={bgCor(weakness)}
                        style={styles.weaknessIcon}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.infoText2}>
                  Nenhuma fraqueza encontrada
                </Text>
              )}
            </View>

            {/* Training */}
            <Text
              style={[
                styles.greenText,
                { color: TextCor(pokemon.types[0].type.name) },
              ]}
            >
              Training
            </Text>

            {/* EV Yield */}
            <Text style={styles.infoText1}>
              EV Yield{"                   "}
              <Text style={styles.infoText2}>
                {specialAttackEffort} Special Attack
              </Text>
            </Text>

            {/* Catch Rate */}
            <Text style={styles.infoText1}>
              Catch Rate{"              "}
              <Text style={styles.infoText2}>
                45{" "}
                <Text style={styles.smallText}>
                  (5.9% with PokéBall, full HP)
                </Text>
              </Text>
            </Text>

            {/* Base Friendship */}
            <Text style={styles.infoText1}>
              Base Friendship{"    "}
              <Text style={styles.infoText2}>70 </Text>
              <Text style={styles.smallText}>(normal)</Text>
            </Text>

            {/* Base Exp */}
            <Text style={styles.infoText1}>
              Base Exp{"                 "}
              <Text style={styles.infoText2}>{xp}</Text>
            </Text>

            {/* Growth Rate */}
            <Text style={styles.infoText1}>
              Growth Rate{"           "}
              <Text style={styles.infoText2}>Medium Slow </Text>
            </Text>

            {/* Breeding */}
            <Text
              style={[
                styles.greenText,
                { color: TextCor(pokemon.types[0].type.name) },
              ]}
            >
              Breeding
            </Text>

            {/* Gender */}
            <Text style={styles.infoText1}>
              Gender{"                    "}
              <Text style={styles.infoText2}>
                <Text style={{ color: "#588fd8" }}>♂ {gender.male}%</Text>,{" "}
                <Text style={{ color: "#ed6ec7" }}>♀ {gender.female}%</Text>
              </Text>
            </Text>

            {/* Egg Groups */}
            <Text style={styles.infoText1}>
              Egg Groups{"           "}
              <Text style={styles.infoText2}>
                {eggGroups.join(", ").charAt(0).toUpperCase() +
                  eggGroups.join(", ").slice(1)}
              </Text>
            </Text>

            {/* Egg Cycles */}
            <Text style={styles.infoText1}>
              Egg Cycles{"            "}
              <Text style={styles.infoText2}>
                {eggCycles}
                {""} <Text style={styles.smallText}>({hatchSteps})</Text>
              </Text>
            </Text>

            {/* Location */}
            <Text
              style={[
                styles.greenText,
                { color: TextCor(pokemon.types[0].type.name) },
              ]}
            >
              Location
            </Text>

            {/* Red/Blue/Yellow */}
            <Text style={styles.infoText1}>
              {pokemon.id.toString().padStart(3, "0")}
              {"                         "}
              <Text style={styles.infoText2}>(Red/Blue/Yellow)</Text>
            </Text>

            {/* Gold/Silver/Crystal */}
            <Text style={styles.infoText1}>
              {`${pokemon.id + 225}`}
              {"                         "}
              <Text style={styles.infoText2}>{`(Gold/Silver/Crystal)`} </Text>
            </Text>

            {/* FireRed/LeafGreen */}
            <Text style={styles.infoText1}>
              {pokemon.id.toString().padStart(3, "0")}
              {"                         "}
              <Text style={styles.infoText2}>(FireRed/LeafGreen)</Text>
            </Text>

            {/* HeartGold/SoulSilver */}
            <Text style={styles.infoText1}>
              {`${pokemon.id + 230}`}
              {"                         "}
              <Text style={styles.infoText2}>(HeartGold/SoulSilver)</Text>
            </Text>

            {/* X/Y - Central Kalos */}
            <Text style={styles.infoText1}>
              {`${(pokemon.id + 79).toString().padStart(3, "0")}`}
              {"                         "}
              <Text style={styles.infoText2}>{`(X/Y - Central Kalos)`} </Text>
            </Text>

            {/* Let's Go Pikachu/Let's Go Eevee */}
            <Text style={styles.infoText1}>
              {pokemon.id.toString().padStart(3, "0")}
              {"                         "}
              <Text style={styles.infoText2}>
                (Let's Go Pikachu/Let's Go Eevee)
              </Text>
            </Text>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal Stats */}
      <Modal
        visible={activeModal === "stats"}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={onBack}>
            <Image source={ImagensIcon.icons.exit} style={styles.closeButton} />
          </TouchableOpacity>
        </View>
        {renderModal()}
        <View style={[styles.descriptionContainer, { flex: 1 }]}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Text
              style={[
                styles.greenText,
                { color: TextCor(pokemon.types[0].type.name) },
              ]}
            >
              Base Stats
            </Text>

            {/* Hp */}
            <View style={styles.statSection}>
              <Text style={styles.infoText1}>Hp{"                 "}</Text>
              {renderStat("hp")}
            </View>

            {/* Attack */}
            <View style={styles.statSection}>
              <Text style={styles.infoText1}>Attack{"           "}</Text>
              {renderStat("attack")}
            </View>

            {/* Defense */}
            <View style={styles.statSection}>
              <Text style={styles.infoText1}>Defense{"        "}</Text>
              {renderStat("defense")}
            </View>

            {/* Sp. Attack */}
            <View style={styles.statSection}>
              <Text style={styles.infoText1}>Sp. Attack{"     "}</Text>
              {renderStat("special-attack")}
            </View>

            {/* Sp. Defense */}
            <View style={styles.statSection}>
              <Text style={styles.infoText1}>Sp. Defense{"  "}</Text>
              {renderStat("special-defense")}
            </View>

            {/* Speed */}
            <View style={styles.statSection}>
              <Text style={styles.infoText1}>Speed{"             "}</Text>
              {renderStat("speed")}
            </View>

            {/* Total */}
            <View style={styles.statSection}>
              <Text style={styles.infoText1}>Total{"               "}</Text>
              <Text style={styles.infoText2}>
                {calculateTotal().toString().padStart(3, "0")}
                {"                                               "}Min
                {"        "}Max
              </Text>
            </View>

            <Text style={styles.infoText2}>
              The ranges shown on the right are for a level 100 Pokémon. Maximum
              values are based on a beneficial nature, 252 EVs, 31 IVs; minimum
              values are based on a hindering nature, 0 EVs, 0 IVs.
            </Text>

          </ScrollView>
        </View>
      </Modal>

      {/* Modal Evolution */}
      <Modal
        visible={activeModal === "evolution"}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={onBack}>
            <Image source={ImagensIcon.icons.exit} style={styles.closeButton} />
          </TouchableOpacity>
        </View>
        {renderModal()}
        <View style={styles.descriptionContainer}>
          <Text
            style={[
              styles.greenText,
              { color: TextCor(pokemon.types[0].type.name) },
            ]}
          >
            Evolution Chart
          </Text>
          {evolutions.map((evolution, index) => {
            const nextEvolution = evolutions[index + 1];
            if (!nextEvolution) return null;

            return (
              <View key={evolution.id} style={styles.evolutionContainer}>
                {/* Evolução atual */}
                <View style={styles.evolutionItemContainer}>
                  <Image
                    source={{ uri: evolution.image }}
                    style={styles.evolutionPokemonImage}
                  />
                  <Image
                    source={ImagensIcon.icons.pokeball}
                    style={styles.evolutionPokeBallImage}
                  />
                  <Text style={styles.evolutionIdText}>{`#${evolution.id
                    .toString()
                    .padStart(3, "0")}`}</Text>
                  <Text style={styles.evolutionNameText}>
                    {evolution.name.charAt(0).toUpperCase() +
                      evolution.name.slice(1)}
                  </Text>
                </View>

                {/* Arrow */}
                <Image
                  source={ImagensIcon.icons.flecha}
                  style={styles.arrowIcon}
                />

                {/* Próxima evolução */}
                <View style={styles.evolutionItemContainer}>
                  <Image
                    source={{ uri: nextEvolution.image }}
                    style={styles.evolutionPokemonImage}
                  />
                  <Image
                    source={ImagensIcon.icons.pokeball}
                    style={styles.evolutionPokeBallImage}
                  />
                  <Text style={styles.evolutionIdText}>{`#${nextEvolution.id
                    .toString()
                    .padStart(3, "0")}`}</Text>
                  <Text style={styles.evolutionNameText}>
                    {nextEvolution.name.charAt(0).toUpperCase() +
                      nextEvolution.name.slice(1)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

export default PokemonProfile;
