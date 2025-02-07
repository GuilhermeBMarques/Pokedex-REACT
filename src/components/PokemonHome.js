import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import PokemonList from "./PokemonCard.js";
import Profile from "../pages/Profile.jsx";
import styles from "../styles/HomeStyles.js";
import ImagensIcon from "../utils/Imagens.js";
import Slider from "@react-native-community/slider";
import { debounce } from "lodash";

const PokemonHome = () => {
  const [list, setList] = useState([]);
  const [displayedList, setDisplayedList] = useState([]);
  const [search, setSearch] = useState("");
  const [nextUrl, setNextUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=898"
  );
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalStates, setModalStates] = useState({
    generations: false,
    sort: false,
    filter: false,
  });

  const [activeGenButton, setActiveGenButton] = useState("geno");
  const [activeSortButton, setActiveSortButton] = useState("numberAsc");
  const [sortType, setSortType] = useState("number");
  const [sortOrder, setSortOrder] = useState("asc");
  const [notFoundMessage, setNotFoundMessage] = useState("");

  // Estados para filtros
  const [selectedTypes, setSelectedTypes] = useState(null);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedHeights, setSelectedHeights] = useState(null);
  const [rangeValue, setRangeValue] = useState(280);

  // Estados para botões ativos
  const [activeTypesButton, setActiveTypesButton] = useState(null);
  const [activeWeaknessesButton, setActiveWeaknessesButton] = useState(null);
  const [activeHeightButton, setActiveHeightButton] = useState(null);
  const [activeWeightButton, setActiveWeightButton] = useState(null);

  // Cores dos botões
  const [applyButtonColor, setApplyButtonColor] = useState("#F2F2F2");
  const [resetButtonColor, setResetButtonColor] = useState("#F2F2F2");

  // Estados para filtros
  const [lastClickedFilter1, setLastClickedFilter1] = useState(null);
  const [lastClickedFilter2, setLastClickedFiltlastClickedFilter2] =
    useState(null);
  const [lastSortKey, setLastSortKey] = useState("numberAsc");

  // Função para manipular mudanças no slider
  const handleSliderChange = (value) => {
    const roundedValue = Math.round(value);
    setRangeValue(roundedValue);
    strengthPokemon();
  };

  // Debounce para otimizar mudanças no slider
  const debouncedSliderChange = useMemo(
    () => debounce(handleSliderChange, 300),
    [handleSliderChange]
  );

  // Função chamada quando o valor do slider muda
  const onSliderValueChange = (newValue) => {
    debouncedSliderChange(newValue);
  };

  // Função para manipular o clique no botão de geração
  const handleGenButtonPress = useCallback(
    (button) => {
      setActiveGenButton(button);
      const generation = filterData.generations.find(
        (gen) => gen.id === button
      );
      if (generation) {
        filterGeneration(generation.start, generation.end);
      }
    },
    [
      activeGenButton,
      selectedTypes,
      selectedWeaknesses,
      selectedWeight,
      selectedHeights,
    ]
  );

  // Função para manipular o clique no botão de tipos
  const handleTypesButtonPress = useCallback(
    (button) => {
      setActiveWeaknessesButton(null);
      setActiveTypesButton(activeTypesButton === button ? null : button);
      setLastClickedFilter1("types");
    },
    [activeTypesButton]
  );

  // Função para manipular o clique no botão de fraquezas
  const handleWeaknessesButtonPress = useCallback(
    (button) => {
      setActiveTypesButton(null);
      setActiveWeaknessesButton(
        activeWeaknessesButton === button ? null : button
      );
      setLastClickedFilter1("weaknesses");
    },
    [activeWeaknessesButton]
  );

  // Função para manipular o clique no botão de altura
  const handleHeightButtonPress = useCallback(
    (button) => {
      setActiveWeightButton(null);
      setActiveHeightButton(activeHeightButton === button ? null : button);
      setLastClickedFiltlastClickedFilter2("heights");
    },
    [activeHeightButton]
  );

  // Função para manipular o clique no botão de peso
  const handleWeightButtonPress = useCallback(
    (button) => {
      setActiveHeightButton(null);
      setActiveWeightButton(activeWeightButton === button ? null : button);
      setLastClickedFiltlastClickedFilter2("weight");
    },
    [activeWeightButton]
  );

  // Função para manipular o clique no botão de ordenação
  const handleSortButtonPress = useCallback(
    (button) => {
      setActiveSortButton(button);
      setLastSortKey(button);
    },
    [activeSortButton]
  );

  // Filtragem de Pokémons com base na busca do usuário
  const filteredList = useMemo(() => {
    const filtered = displayedList.filter((pokemon) => {
      const searchLower = search.toLowerCase();
      return (
        pokemon.name.toLowerCase().includes(searchLower) ||
        pokemon.id.toLowerCase().includes(search.toLowerCase())
      );
    });

    if (filtered.length === 0 && search) {
      setNotFoundMessage("Pokémon não encontrado!");
    } else {
      setNotFoundMessage("");
    }

    return filtered;
  }, [displayedList, search]);

  // Função para buscar Pokémons da API
  const fetchPokemon = useCallback(() => {
    if (!nextUrl) return;

    axios
      .get(nextUrl)
      .then((response) => {
        const newPokemons = response.data.results.map((pokemon, index) => {
          const id = pokemon.url.split("/").slice(-2, -1)[0];
          return { ...pokemon, id };
        });

        const uniquePokemons = newPokemons.filter(
          (newPokemon) =>
            !list.some((existing) => existing.id === newPokemon.id)
        );

        setList((prevList) => {
          const updatedList = [...prevList, ...uniquePokemons];
          setDisplayedList(updatedList);
          return updatedList;
        });
        setNextUrl(response.data.next);
      })
      .catch((error) => console.error(error));
  }, [nextUrl, list]);

  // Efeito para buscar Pokémon ao montar o componente
  useEffect(() => {
    fetchPokemon();
  }, []);

  // Efeito para filtrar Pokémon pela geração ativa
  useEffect(() => {
    if (list.length > 0) {
      const generationData = filterData.generations.find(
        (gen) => gen.id === activeGenButton
      );
      if (generationData) {
        filterGeneration(generationData.start, generationData.end);
      }
    }
  }, [activeGenButton, list.length]);

  // Função para mostrar detalhes do Pokémon selecionado
  const showPokemonProfile = async (pokemon) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      const speciesResponse = await axios.get(response.data.species.url);
      const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
      const evolutionChainResponse = await axios.get(evolutionChainUrl);

      const evolutions = [];
      let currentEvolution = evolutionChainResponse.data.chain;

      while (currentEvolution) {
        const evolutionName = currentEvolution.species.name;
        const evolutionData = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${evolutionName}`
        );
        evolutions.push({
          name: evolutionName,
          image: evolutionData.data.sprites.front_default,
        });
        currentEvolution = currentEvolution.evolves_to[0];
      }

      setSelectedPokemon({ ...response.data, evolutions });
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  // Função para voltar ao estado anterior
  const goBack = () => {
    setSelectedPokemon(null);
  };

  // Função para alternar modais
  const toggleModal = (modalType) => {
    setModalStates((prev) => ({ ...prev, [modalType]: !prev[modalType] }));
  };

  // Função para fechar modais
  const closeModal = (modalType) => {
    setModalStates((prev) => ({ ...prev, [modalType]: false }));
  };

  // Função para filtrar Pokémon pela geração
  const filterGeneration = (startId, endId) => {
    const filteredList = list.filter(
      (pokemon) => pokemon.id >= startId && pokemon.id <= endId
    );

    const sortedList = sortPokemons(filteredList);
    setDisplayedList(sortedList);

    let finalList = sortedList;

    if (selectedTypes) {
      finalList = finalList.filter((pokemon) =>
        pokemon.types?.some((t) => t.type.name === selectedTypes)
      );
    }

    if (selectedHeights) {
      finalList = finalList.filter((pokemon) => {
        if (selectedHeights === "smallAlt") {
          return pokemon.height >= 0 && pokemon.height <= 15;
        } else if (selectedHeights === "mediumAlt") {
          return pokemon.height > 15 && pokemon.height <= 87;
        } else if (selectedHeights === "largeAlt") {
          return pokemon.height > 87;
        }
      });
    }

    if (selectedWeight) {
      finalList = finalList.filter((pokemon) => {
        if (selectedWeight === "small") {
          return pokemon.weight >= 0 && pokemon.weight <= 29;
        } else if (selectedWeight === "medium") {
          return pokemon.weight > 220 && pokemon.weight <= 4599;
        } else if (selectedWeight === "large") {
          return pokemon.weight > 4600;
        }
      });
    }

    setDisplayedList(finalList);
    setNextUrl(null);
  };

  // Componente para botão de ordenação
  const SortButton = ({ label, sortKey, type, order }) => (
    <TouchableOpacity
      style={[
        styles.sortBtn,
        activeSortButton === sortKey && { backgroundColor: "#EA5D60" },
      ]}
      onPress={() => {
        sortList({ type, order });
        handleSortButtonPress(sortKey);
      }}
    >
      <Text
        style={[
          styles.btnText,
          activeSortButton === sortKey && { color: "#fff" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Função para ordenar Pokémons
  const sortPokemons = (pokemons) => {
    return pokemons.sort((a, b) => {
      if (sortType === "number") {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      } else if (sortType === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
  };

  // Função para ordenar a lista de Pokémons
  const sortList = ({ type, order }) => {
    setSortType(type);
    setSortOrder(order);

    const sortedList = [...displayedList].sort((a, b) => {
      if (type === "number") {
        return order === "asc" ? a.id - b.id : b.id - a.id;
      } else if (type === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
    setDisplayedList(sortedList);
  };

  // Função para renderizar a seção de filtros
  const renderFilterSection = (
    title,
    data,
    activeButton,
    handleButtonPress,
    setSelected
  ) => (
    <>
      <Text style={styles.filterTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map(({ id, valorPeso, cor, icone }) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.filterBtn,
              activeButton === id && { backgroundColor: cor },
            ]}
            onPress={() => {
              handleButtonPress(id);
              setSelected(valorPeso);
            }}
          >
            <Image
              source={icone}
              style={[
                styles.filterIcon,
                activeButton === id && { tintColor: "#FFFFFF" },
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  // Dados para filtros
  const filterData = {
    generations: [
      {
        id: "geno",
        name: "Generation I",
        start: 1,
        end: 151,
        images: [
          ImagensIcon.pokemons.bulbasaur,
          ImagensIcon.pokemons.charmander,
          ImagensIcon.pokemons.squirtle,
        ],
      },
      {
        id: "genoII",
        name: "Generation II",
        start: 152,
        end: 251,
        images: [
          ImagensIcon.pokemons.chikorita,
          ImagensIcon.pokemons.cyndaquil,
          ImagensIcon.pokemons.totodile,
        ],
      },
      {
        id: "genoIII",
        name: "Generation III",
        start: 252,
        end: 386,
        images: [
          ImagensIcon.pokemons.treecko,
          ImagensIcon.pokemons.torchic,
          ImagensIcon.pokemons.mudkip,
        ],
      },
      {
        id: "genoIV",
        name: "Generation IV",
        start: 387,
        end: 493,
        images: [
          ImagensIcon.pokemons.turtwig,
          ImagensIcon.pokemons.chimchar,
          ImagensIcon.pokemons.piplup,
        ],
      },
      {
        id: "genoV",
        name: "Generation V",
        start: 494,
        end: 649,
        images: [
          ImagensIcon.pokemons.snivy,
          ImagensIcon.pokemons.tepig,
          ImagensIcon.pokemons.oshawott,
        ],
      },
      {
        id: "genoVI",
        name: "Generation VI",
        start: 650,
        end: 721,
        images: [
          ImagensIcon.pokemons.chespin,
          ImagensIcon.pokemons.fennekin,
          ImagensIcon.pokemons.froakie,
        ],
      },
      {
        id: "genoVII",
        name: "Generation VII",
        start: 722,
        end: 807,
        images: [
          ImagensIcon.pokemons.rowlet,
          ImagensIcon.pokemons.litten,
          ImagensIcon.pokemons.popplio,
        ],
      },
      {
        id: "genoVIII",
        name: "Generation VIII",
        start: 808,
        end: 898,
        images: [
          ImagensIcon.pokemons.sobble,
          ImagensIcon.pokemons.scorbunny,
          ImagensIcon.pokemons.popplio,
        ],
      },
    ],
    sort: [
      {
        label: "Smallest number first",
        sortKey: "numberAsc",
        type: "number",
        order: "asc",
      },
      {
        label: "Highest number first",
        sortKey: "numberDesc",
        type: "number",
        order: "desc",
      },
      {
        label: "A-Z",
        sortKey: "nameAsc",
        type: "name",
        order: "asc",
      },
      {
        label: "Z-A",
        sortKey: "nameDesc",
        type: "name",
        order: "desc",
      },
    ],
    types: [
      {
        id: "filter1",
        valorPeso: "bug",
        cor: "#8CB230",
        icone: ImagensIcon.filtros.filtro1,
      },
      {
        id: "filter2",
        valorPeso: "dark",
        cor: "#58575F",
        icone: ImagensIcon.filtros.filtro2,
      },
      {
        id: "filter3",
        valorPeso: "dragon",
        cor: "#0F6AC0",
        icone: ImagensIcon.filtros.filtro3,
      },
      {
        id: "filter4",
        valorPeso: "electric",
        cor: "#E1E200",
        icone: ImagensIcon.filtros.filtro4,
      },
      {
        id: "filter5",
        valorPeso: "fairy",
        cor: "#F4A6CB",
        icone: ImagensIcon.filtros.filtro5,
      },
      {
        id: "filter6",
        valorPeso: "fighting",
        cor: "#D04164",
        icone: ImagensIcon.filtros.filtro6,
      },
      {
        id: "filter7",
        valorPeso: "fire",
        cor: "#FD7D27",
        icone: ImagensIcon.filtros.filtro7,
      },
      {
        id: "filter8",
        valorPeso: "flying",
        cor: "#748FC9",
        icone: ImagensIcon.filtros.filtro8,
      },
      {
        id: "filter9",
        valorPeso: "ghost",
        cor: "#556AAE",
        icone: ImagensIcon.filtros.filtro9,
      },
      {
        id: "filter10",
        valorPeso: "grass",
        cor: "#62B957",
        icone: ImagensIcon.filtros.filtro10,
      },
      {
        id: "filter11",
        valorPeso: "ground",
        cor: "#DD7748",
        icone: ImagensIcon.filtros.filtro11,
      },
      {
        id: "filter12",
        valorPeso: "ice",
        cor: "#61CEC0",
        icone: ImagensIcon.filtros.filtro12,
      },
      {
        id: "filter13",
        valorPeso: "normal",
        cor: "#9DA0AA",
        icone: ImagensIcon.filtros.filtro13,
      },
      {
        id: "filter14",
        valorPeso: "poison",
        cor: "#A552CC",
        icone: ImagensIcon.filtros.filtro14,
      },
      {
        id: "filter15",
        valorPeso: "psychic",
        cor: "#EA5D60",
        icone: ImagensIcon.filtros.filtro15,
      },
      {
        id: "filter16",
        valorPeso: "rock",
        cor: "#BAAB82",
        icone: ImagensIcon.filtros.filtro16,
      },
      {
        id: "filter17",
        valorPeso: "steel",
        cor: "#417D9A",
        icone: ImagensIcon.filtros.filtro17,
      },
      {
        id: "filter18",
        valorPeso: "water",
        cor: "#4A90DA",
        icone: ImagensIcon.filtros.filtro18,
      },
    ],

    heights: [
      {
        id: "filter37",
        valorPeso: "smallAlt",
        cor: "#FFC5E6",
        icone: ImagensIcon.filtros.filtro19,
      },
      {
        id: "filter38",
        valorPeso: "mediumAlt",
        cor: "#AEBFD7",
        icone: ImagensIcon.filtros.filtro20,
      },
      {
        id: "filter39",
        valorPeso: "largeAlt",
        cor: "#AAACB8",
        icone: ImagensIcon.filtros.filtro21,
      },
    ],
    weights: [
      {
        id: "filter40",
        valorPeso: "small",
        cor: "#99CD7C",
        icone: ImagensIcon.filtros.filtro22,
      },
      {
        id: "filter41",
        valorPeso: "medium",
        cor: "#57B2DC",
        icone: ImagensIcon.filtros.filtro23,
      },
      {
        id: "filter42",
        valorPeso: "large",
        cor: "#5A92A5",
        icone: ImagensIcon.filtros.filtro24,
      },
    ],
  };

  // Função para filtrar Pokémons por tipo
  const typesPokemon = async (type) => {
    const typeCache = new Map();

    const fetchTypes = async (pokemon) => {
      if (!pokemon.types) {
        if (typeCache.has(pokemon.name)) {
          return { ...pokemon, types: typeCache.get(pokemon.name) };
        }

        try {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
          );
          const types = response.data.types;
          typeCache.set(pokemon.name, types);
          return { ...pokemon, types };
        } catch (error) {
          console.error(`Error fetching types for ${pokemon.name}:`, error);
        }
      }
      return pokemon;
    };

    const pokemonsWithTypes = await Promise.all(list.map(fetchTypes));

    const generationData = filterData.generations.find(
      (gen) => gen.id === activeGenButton
    );
    const filteredPokemons = pokemonsWithTypes.filter((pokemon) => {
      const id = parseInt(pokemon.id);
      return (
        id >= generationData.start &&
        id <= generationData.end &&
        pokemon.types?.some((t) => t.type.name === type)
      );
    });

    const sortedFilteredPokemons = filteredPokemons.sort((a, b) => {
      const compare =
        sortType === "number" ? a.id - b.id : a.name.localeCompare(b.name);
      return sortOrder === "asc" ? compare : -compare;
    });

    setList(pokemonsWithTypes);
    setDisplayedList(sortedFilteredPokemons);
  };

  // Função para filtrar Pokémons por fraquezas
  const weaknessesPokemon = async (type) => {
    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/type/${type}`
      );
      const weaknesses = data.damage_relations.double_damage_from.map(
        (weakness) => weakness.name
      );
      const typeCache = new Map();

      const filteredPokemons = await Promise.all(
        list.map(async (pokemon) => {
          if (typeCache.has(pokemon.name)) {
            return weaknesses.some((weakness) =>
              typeCache.get(pokemon.name).includes(weakness)
            )
              ? pokemon
              : null;
          }

          try {
            const { data: pokemonData } = await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
            );
            const typesPokemon = pokemonData.types.map((t) => t.type.name);
            typeCache.set(pokemon.name, typesPokemon);
            return weaknesses.some((weakness) =>
              typesPokemon.includes(weakness)
            )
              ? pokemon
              : null;
          } catch (error) {
            console.error(`Error fetching types for ${pokemon.name}:`, error);
            return null;
          }
        })
      );

      const generation = filterData.generations.find(
        (gen) => gen.id === activeGenButton
      );
      if (!generation) {
        console.error("Geração não encontrada:", activeGenButton);
        return;
      }

      const generationFilteredPokemons = filteredPokemons.filter((pokemon) => {
        if (!pokemon) return false;
        const id = parseInt(pokemon.id);
        return id >= generation.start && id <= generation.end;
      });

      const sortedFilteredPokemons = generationFilteredPokemons
        .filter(Boolean)
        .sort((a, b) => {
          const compare =
            sortType === "number" ? a.id - b.id : a.name.localeCompare(b.name);
          return sortOrder === "asc" ? compare : -compare;
        });

      setDisplayedList(sortedFilteredPokemons);
    } catch (error) {
      console.error("Erro ao buscar fraquezas:", error);
    }
  };

  // Função para filtrar Pokémons por altura
  const heightPokemon = async (minHeight, maxHeight) => {
    const heightCache = new Map();

    const fetchHeight = async (pokemon) => {
      if (!pokemon.height) {
        if (heightCache.has(pokemon.name)) {
          return { ...pokemon, height: heightCache.get(pokemon.name) };
        }

        try {
          const { data } = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
          );
          const height = data.height;
          heightCache.set(pokemon.name, height);
          return { ...pokemon, height };
        } catch (error) {
          console.error(`Error fetching height for ${pokemon.name}:`, error);
        }
      }
      return pokemon;
    };

    const pokemonsWithHeights = await Promise.all(list.map(fetchHeight));
    setList(pokemonsWithHeights);

    const generation = filterData.generations.find(
      (gen) => gen.id === activeGenButton
    );
    const generationFilteredPokemons = pokemonsWithHeights.filter((pokemon) => {
      const id = parseInt(pokemon.id);
      return id >= generation.start && id <= generation.end;
    });

    const filteredPokemons = generationFilteredPokemons.filter((pokemon) =>
      maxHeight === null
        ? pokemon.height >= minHeight
        : pokemon.height >= minHeight && pokemon.height < maxHeight
    );

    const sortedFilteredPokemons = filteredPokemons.sort((a, b) => {
      const compare =
        sortType === "number" ? a.id - b.id : a.name.localeCompare(b.name);
      return sortOrder === "asc" ? compare : -compare;
    });

    setDisplayedList(sortedFilteredPokemons);
  };

  // Função para filtrar Pokémons por peso
  const weightPokemon = async (minWeight, maxWeight) => {
    const weightCache = new Map();

    const fetchWeight = async (pokemon) => {
      if (!pokemon.weight) {
        if (weightCache.has(pokemon.name)) {
          return { ...pokemon, weight: weightCache.get(pokemon.name) };
        }

        try {
          const { data } = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
          );
          const weight = data.weight;
          weightCache.set(pokemon.name, weight);
          return { ...pokemon, weight };
        } catch (error) {
          console.error(`Error fetching weight for ${pokemon.name}:`, error);
        }
      }
      return pokemon;
    };

    const pokemonsWithWeights = await Promise.all(list.map(fetchWeight));
    setList(pokemonsWithWeights);

    const generation = filterData.generations.find(
      (gen) => gen.id === activeGenButton
    );
    const generationFilteredPokemons = pokemonsWithWeights.filter((pokemon) => {
      const id = parseInt(pokemon.id);
      return id >= generation.start && id <= generation.end;
    });

    const filteredPokemons = generationFilteredPokemons.filter((pokemon) =>
      maxWeight === null
        ? pokemon.weight >= minWeight
        : pokemon.weight >= minWeight && pokemon.weight < maxWeight
    );

    const sortedFilteredPokemons = filteredPokemons.sort((a, b) => {
      const compare =
        sortType === "number" ? a.id - b.id : a.name.localeCompare(b.name);
      return sortOrder === "asc" ? compare : -compare;
    });

    setDisplayedList(sortedFilteredPokemons);
  };

  // Função para filtrar Pokémons pela força
  const strengthPokemon = async () => {
    const generation = filterData.generations.find(
      (gen) => gen.id === activeGenButton
    );
    if (!generation) {
      console.error("Geração não encontrada:", activeGenButton);
      return;
    }

    const pokemonsComForca = await Promise.all(
      list.map(async (pokemon) => {
        if (!pokemon.stats) {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
          );
          return { ...pokemon, stats: response.data.stats };
        }
        return pokemon;
      })
    );

    const pokemonsFiltrados = pokemonsComForca.filter((pokemon) => {
      const id = parseInt(pokemon.id);
      const ataque = pokemon.stats?.find(
        (stat) => stat.stat.name === "attack"
      )?.base_stat;
      return (
        id >= generation.start && id <= generation.end && ataque <= rangeValue
      );
    });

    const sortedFilteredPokemons = pokemonsFiltrados.sort((a, b) => {
      const compare =
        sortType === "number" ? a.id - b.id : a.name.localeCompare(b.name);
      return sortOrder === "asc" ? compare : -compare;
    });

    setDisplayedList(sortedFilteredPokemons);
  };

  // Função para aplicar filtros
  const Apply = () => {
    setApplyButtonColor("#EA5D60");

    if (lastClickedFilter1 === "types" && selectedTypes) {
      setSelectedWeight(null);
      setSelectedHeights(null);
      setSelectedWeaknesses(null);
      typesPokemon(selectedTypes);
    } else if (lastClickedFilter1 === "weaknesses" && selectedWeaknesses) {
      setSelectedWeight(null);
      setSelectedHeights(null);
      setSelectedTypes(null);
      weaknessesPokemon(selectedWeaknesses);
    }

    if (lastClickedFilter2 === "heights" && selectedHeights) {
      setSelectedTypes(null);
      setSelectedWeaknesses(null);
      setSelectedWeight(null);
      switch (selectedHeights) {
        case "smallAlt":
          heightPokemon(0, 15);
          break;
        case "mediumAlt":
          heightPokemon(16, 87);
          break;
        case "largeAlt":
          heightPokemon(88, Infinity);
          break;
      }
    } else if (lastClickedFilter2 === "weight" && selectedWeight) {
      setSelectedTypes(null);
      setSelectedWeaknesses(null);
      setSelectedHeights(null);
      switch (selectedWeight) {
        case "small":
          weightPokemon(0, 29);
          break;
        case "medium":
          weightPokemon(220, 4599);
          break;
        case "large":
          weightPokemon(4600, Infinity);
          break;
      }
    }

    setTimeout(() => {
      setActiveSortButton(lastSortKey);
      setApplyButtonColor("#F2F2F2");
    }, 2000);
  };

  // Função para resetar filtros
  const Reset = () => {
    setResetButtonColor("#EA5D60");

    setRangeValue(280);
    setDisplayedList(list);

    setSelectedTypes(null);
    setActiveTypesButton(null);

    setSelectedWeaknesses(null);
    setActiveWeaknessesButton(null);

    setSelectedWeight(null);
    setActiveWeightButton(null);

    setSelectedHeights(null);
    setActiveHeightButton(null);

    requestAnimationFrame(() => {
      setDisplayedList(list);
    });

    setTimeout(() => {
      setActiveGenButton("geno");
      setActiveSortButton("numberAsc");
      setResetButtonColor("#F2F2F2");
    }, 2000);
  };

  return (
    <SafeAreaView>
      {selectedPokemon ? (
        <Profile pokemon={selectedPokemon} onBack={goBack} />
      ) : (
        <View>
          <Image source={ImagensIcon.icons.semiBall} style={styles.pokeball} />

          {/* Container Main */}
          <View style={styles.container}>
            <View style={styles.containerIcons}>
              <TouchableOpacity onPress={() => toggleModal("generations")}>
                <Image
                  source={ImagensIcon.icons.geracao}
                  style={styles.icons}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleModal("sort")}>
                <Image
                  source={ImagensIcon.icons.organizar}
                  style={styles.icons}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleModal("filter")}>
                <Image source={ImagensIcon.icons.filtro} style={styles.icons} />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Pokédex</Text>
            <Text style={styles.subtitle}>
              Search for Pokémon by name or using the National Pokédex number.
            </Text>
            <View style={styles.searchContainer}>
              <Image
                source={ImagensIcon.icons.search}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="What Pokémon are you looking for?"
              />
            </View>
          </View>

          {/* Modal Generations */}
          <Modal
            visible={modalStates.generations}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => closeModal("generations")}
              ></TouchableOpacity>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Generations</Text>
                <Text style={[styles.modalDescription, { height: 50 }]}>
                  Use search for generations to explore your Pokémon!
                </Text>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  horizontal={false}
                >
                  <View style={styles.generationsContainer}>
                    {filterData.generations.map((gen) => (
                      <TouchableOpacity
                        key={gen.id}
                        style={[
                          styles.generationBtn,
                          activeGenButton === gen.id && {
                            backgroundColor: "#EA5D60",
                          },
                        ]}
                        onPress={() => {
                          filterGeneration(gen.start, gen.end);
                          handleGenButtonPress(gen.id);
                        }}
                      >
                        <View style={styles.generationBtnContent}>
                          {gen.images.map((image, index) => (
                            <Image
                              key={index}
                              source={image}
                              style={styles.generationImg}
                            />
                          ))}
                        </View>
                        <Text
                          style={[
                            styles.generationName,
                            activeGenButton === gen.id && { color: "#fff" },
                          ]}
                        >
                          {gen.name}
                        </Text>
                        <Image
                          source={ImagensIcon.icons.pattern2}
                          style={styles.effect1}
                        />
                        <Image
                          source={ImagensIcon.icons.clearBall}
                          style={styles.effect2}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Modal Sort */}
          <Modal
            visible={modalStates.sort}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => closeModal("sort")}
              ></TouchableOpacity>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Sort</Text>
                <Text style={[styles.modalDescription, { height: 50 }]}>
                  Sort Pokémons alphabetically or by National Pokédex number!
                </Text>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  horizontal={false}
                >
                  {filterData.sort.map((sortOption) => (
                    <SortButton
                      key={sortOption.sortKey}
                      label={sortOption.label}
                      sortKey={sortOption.sortKey}
                      type={sortOption.type}
                      order={sortOption.order}
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Modal Filters */}
          <Modal
            visible={modalStates.filter}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => closeModal("filter")}
              ></TouchableOpacity>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Filters</Text>
                <Text style={[styles.modalDescription, { height: 50 }]}>
                  Use advanced search to explore Pokémon by type, weakness,
                  height and more!
                </Text>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  horizontal={false}
                >
                  {renderFilterSection(
                    "Types",
                    filterData.types,
                    activeTypesButton,
                    handleTypesButtonPress,
                    setSelectedTypes
                  )}
                  {renderFilterSection(
                    "Weaknesses",
                    filterData.types,
                    activeWeaknessesButton,
                    handleWeaknessesButtonPress,
                    setSelectedWeaknesses
                  )}
                  {renderFilterSection(
                    "Heights",
                    filterData.heights,
                    activeHeightButton,
                    handleHeightButtonPress,
                    setSelectedHeights
                  )}
                  {renderFilterSection(
                    "Weights",
                    filterData.weights,
                    activeWeightButton,
                    handleWeightButtonPress,
                    setSelectedWeight
                  )}
                  <Text style={styles.filterTitle}>Number Range</Text>
                  <View>
                    <Slider
                      minimumValue={0}
                      maximumValue={1000}
                      value={rangeValue}
                      onValueChange={onSliderValueChange}
                      style={styles.slider}
                      step={1}
                      minimumTrackTintColor="#EA5D60"
                      thumbTintColor="#EA5D60"
                    />
                    <Text
                      style={[
                        styles.sliderText,
                        {
                          transform: [
                            { translateX: (rangeValue / 1000) * 370 },
                          ],
                        },
                      ]}
                    >
                      {rangeValue}
                    </Text>
                  </View>
                  <View style={styles.filterBtnsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.filterBtnMain,
                        { backgroundColor: resetButtonColor },
                      ]}
                      onPress={() => {
                        Reset();
                        handleSortButtonPress("reseti");
                      }}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          {
                            color:
                              resetButtonColor === "#EA5D60"
                                ? "white"
                                : "#747476",
                          },
                        ]}
                      >
                        Reset
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterBtnMain,
                        { backgroundColor: applyButtonColor },
                      ]}
                      onPress={() => {
                        Apply();
                        handleSortButtonPress("apli");
                      }}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          {
                            color:
                              applyButtonColor === "#EA5D60"
                                ? "white"
                                : "#747476",
                          },
                        ]}
                      >
                        Apply
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
          {notFoundMessage ? (
            <Text style={styles.message}>{notFoundMessage}</Text>
          ) : null}
          <FlatList
            data={filteredList}
            renderItem={({ item }) => (
              <PokemonList item={item} onSelect={showPokemonProfile} />
            )}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            onEndReached={fetchPokemon}
            onEndReachedThreshold={0.1}
            style={{ paddingRight: 20, paddingLeft: 20 }}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default PokemonHome;
