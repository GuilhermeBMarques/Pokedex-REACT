import ImagensIcon from "./Imagens.js";

export const bgCor = (type) => {
  switch (type) {
    case "bug":
      return ImagensIcon.elementos.bug;
    case "dark":
      return ImagensIcon.elementos.dark;
    case "dragon":
      return ImagensIcon.elementos.dragon;
    case "electric":
      return ImagensIcon.elementos.electric;
    case "fairy":
      return ImagensIcon.elementos.fairy;
    case "fighting":
      return ImagensIcon.elementos.fighting;
    case "fire":
      return ImagensIcon.elementos.fire;
    case "flying":
      return ImagensIcon.elementos.flying;
    case "ghost":
      return ImagensIcon.elementos.ghost;
    case "grass":
      return ImagensIcon.elementos.grass;
    case "ground":
      return ImagensIcon.elementos.ground;
    case "ice":
      return ImagensIcon.elementos.ice;
    case "normal":
      return ImagensIcon.elementos.normal;
    case "poison":
      return ImagensIcon.elementos.poison;
    case "psychic":
      return ImagensIcon.elementos.psychic;
    case "rock":
      return ImagensIcon.elementos.rock;
    case "steel":
      return ImagensIcon.elementos.steel;
    case "water":
      return ImagensIcon.elementos.water;
    default:
      return null;
  }
};
