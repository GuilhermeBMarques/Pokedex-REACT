import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 115,
    borderRadius: 10,
    marginBottom: 25,
    display: "flex",
    elevation: 2,
    position: "relative",
    flexDirection: "row",
  },
  pattern: {
    width: 74,
    height: 32,
    left: "26%",
    position: "absolute",
    zIndex: -1,
  },
  pokeball: {
    width: 145,
    height: "100%",
    position: "absolute",
    zIndex: -1,
    right: 0,
  },
  leftSide: {
    width: "40%",
    height: "100%",
    marginTop: 5,
    marginLeft: 20,
  },
  idText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#17171B99",
    marginTop: 15,
  },
  nameText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    flexWrap: "nowrap",
    textOverflow: "ellipsis",
  },
  typeContainer: {
    flexDirection: "row",
  },
  typeBadge: {
    width: 90,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginRight: 5,
    flexDirection: "row",
    elevation: 2,
  },
  typeIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  typeText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  rightSide: {
    width: "60%",
    height: "100%",
  },
  pokemonImg: {
    width: 150,
    height: 150,
    position: "absolute",
    right: 35,
    top: -30,
  },
});

export default styles;
