import Slider from "@react-native-community/slider";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  pokeball: {
    width: "100%",
    height: 200,
    position: "absolute",
    zIndex: -1,
  },

  // Container Principal
  container: {
    width: "100%",
    height: 300,
    padding: 20,
  },
  containerIcons: {
    height: 75,
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  icons: {
    width: 25,
    height: 25,
    marginHorizontal: 15,
  },
  title: {
    color: "#17171B",
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#747476",
    fontSize: 16,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    width: "100%",
    height: 60,
    elevation: 2,
    marginTop: 22,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#747476",
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginRight: 8,
    marginLeft: 16,
  },

  //Modal
  modalContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCloseBtn: {
    width: "100%",
    height: "50%",
  },
  modal: {
    width: "100%",
    height: "50%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 35,
  },
  modalTitle: {
    color: "#17171B",
    fontSize: 26,
    fontWeight: "bold",
  },
  modalDescription: {
    color: "#747476",
    fontSize: 16,
  },

  // Modal Generations
  generationsContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  generationBtn: {
    width: "45%",
    height: 160,
    backgroundColor: "#F2F2F2",
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  generationBtnContent: {
    flexDirection: "row",
  },
  generationImg: {
    width: 50,
    height: 50,
  },
  generationName: {
    color: "#747476",
    fontSize: 16,
  },
  effect1: {
    position: "absolute",
    width: "35%",
    height: "40%",
    right: "55%",
    top: "10%",
  },
  effect2: {
    position: "absolute",
    width: "60%",
    height: "67%",
    left: "50%",
    top: "65%",
  },

  // Modal Sort
  sortBtn: {
    width: "100%",
    height: 65,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    zIndex: 2,
  },

  // Modal Filters
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  filterBtn: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    zIndex: 2,
  },
  filterIcon: {
    width: 25,
    height: 25,
  },
  filterBtnsContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    marginVertical: 50,
  },
  filterBtnMain: {
    width: "45%",
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  filterText: {
    fontSize: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderText: {
    position: "absolute",
    top: 35,
    fontSize: 14,
    color: "#747476",
  },

  message: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default styles;
