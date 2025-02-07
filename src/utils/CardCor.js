export const CardCor = (type) => {
  switch (type) {
    case "grass":
      return "#8BBE8A";
    case "fire":
      return "#FFA756";
    case "water":
      return "#58ABF6";
    case "bug":
      return "#8BD674";
    case "normal":
      return "#B5B9C4";
    case "poison":
      return "#9F6E97";
    case "electric":
      return "#F2CB55";
    case "ground":
      return "#F78551";
    case "fairy":
      return "#EBA8C3";
    case "fighting":
      return "#EB4971";
    case "psychic":
      return "#F85888";
    case "rock":
      return "#B8A038";
    case "ghost":
      return "#705898";
    case "ice":
      return "#98D8D8";
    case "dragon":
      return "#7038F8";
    case "dark":
      return "#705848";
    case "steel":
      return "#B8B8D0";
    case "flying":
      return "#A890F0";
    default:
      return "#A8A878";
  }
};
