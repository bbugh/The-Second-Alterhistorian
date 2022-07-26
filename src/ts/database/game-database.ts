import { _machine, _towns } from "./types";

//@ts-ignore
export let GameDatabase: {
  machines: { [key: string]: _machine };
  towns: { [key in _towns]: any };
} = {};

// Easier Debugging
declare global {
  interface Window {
    GameDatabase: { [key: string]: any };
  }
}

window.GameDatabase = GameDatabase;

export default GameDatabase;
