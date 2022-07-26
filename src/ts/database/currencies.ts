import { _elements } from "./types";

export const Currencies: { [key in _elements]: { colour: string; value: number } } = {
  earth: {
    colour: "#008800",
    value: 0.1,
  },
  water: {
    colour: "#4296c7",
    value: 0.3,
  },
  clay: {
    colour: "#93a070",
    value: 0.5,
  },
  coal: {
    colour: "#060302",
    value: 1,
  },
};

export default Currencies;
