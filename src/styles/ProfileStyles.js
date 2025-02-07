import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
  },

  // Pokemon Header Section
  pokemonContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: 300,
  },
  leftSide: {
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  pokemonImg: {
    width: 200,
    height: 200,
    zIndex: 1,
  },
  circleIcon: {
    width: 100,
    height: 100,
    position: "absolute",
    left: 50,
  },
  rightSide: {
    width: "55%",
    justifyContent: "center",
    alignItems: "start",
  },
  pokemonIdText: {
    color: "#17171B99",
    fontSize: 18,
    fontWeight: "bold",
  },
  pokemonNameText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32,
  },
  typeContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  typeBadge: {
    width: 90,
    height: 25,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  typeIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  typeText: {
    fontSize: 12,
    color: "#FFF",
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  secondaryIcon: {
    width: 65,
    height: 65,
    position: "absolute",
    top: 190,
    marginLeft: "80%",
  },

  // Modal
  modalBackground: {
    width: "100%",
    height: 250,
    zIndex: 1,
  },
  closeButton: {
    width: 20,
    height: 20,
    marginVertical: 25,
    marginHorizontal: 25,
    position: "absolute",
  },

  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  btn: {
    padding: 16,
    borderRadius: 5,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 18,
    zIndex: 1,
  },
  pokeballIcon: {
    width: 100,
    height: 100,
    textAlign: "center",
    position: "absolute",
    left: -10,
    top: 5,
  },
  hiddenPokeball: {
    textAlign: "center",
    position: "absolute",
    opacity: 0,
  },

  // Modal
  descriptionContainer: {
    width: "100%",
    height: "100%",
    padding: 35,
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  greenText: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText1: {
    marginVertical: 10,
    fontSize: 16,
    color: "#17171B",
  },
  infoText2: {
    color: "#747476",
    fontSize: 16,
  },
  smallText: {
    fontSize: 13,
    color: "#747476",
  },
  inlineContainer: {
    flexDirection: "row",
  },

  // Modal About
  weaknessType: {
    width: 25,
    height: 25,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    elevation: 2,
  },
  weaknessIcon: {
    width: 15,
    height: 15,
    borderRadius: 53,
  },

  // Modal Stats
  statSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerStatBar: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  statBar: {
    height: 8,
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: 4,
    maxWidth: "37%",
    elevation: 2,
  },
  statBarFill: {
    height: "100%",
    borderRadius: 4,
  },

  // Modal Evolution
  evolutionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  evolutionItemContainer: {
    alignItems: "center",
    marginHorizontal: 60,
  },
  evolutionPokemonImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
    zIndex: 1,
  },
  evolutionPokeBallImage: {
    position: "absolute",
    width: 125,
    height: 125,
    marginBottom: 5,
  },
  evolutionIdText: {
    color: "#17171B99",
    fontSize: 12,
    fontWeight: "bold",
  },
  evolutionNameText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    color: "#747476",
  },
});

export default styles;
