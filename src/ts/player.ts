import { _resource, _player_save } from "./database/types";
import { defineComponent } from "vue";

namespace Player {
  export const defaultStart = (): _player_save => {
    return {
      money: 0,
      towns: {
        home: {
          machines: [
            0:{
              type: "shoveller",
              x: 50,
              y: 50,
              upgrades: {
                0: 0,
                1: 0,
              },
              outputs: [],
            },
            1:{
              type: "cisthern",
              x: 50,
              y: 350,
              upgrades: {
                0: 0,
              },
              outputs: [],
            },
            2:{
              type: "quarry",
              x: 350,
              y: 50,
              upgrades: {
                0: 0,
              },
              outputs: [],
            },
          ],
        },
      },
      currentlyIn: "home",
      holding: {
        resource: "earth",
        amount: 0,
      },
      display: {
        offset: { x: 0, y: 0 },
      },
    };
  };
  const storageKey = "igj2022-scarlet-summer-alterhistorian2";
  export const load = () => {
    let tempPlayer = JSON.parse(localStorage.getItem(storageKey) as string);
    if (tempPlayer) deepAssign(player, coercePlayer(tempPlayer, defaultStart()));
    fixMachines();
    initializeMachines();
  };
  const coercePlayer = (target: { [key: string]: any }, source: { [key: string]: any }) => {
    if (target === null || target === undefined) return source;
    if (typeof target !== "object") return target;
    let fillObject;
    if (source.constructor === Array) fillObject = [];
    else fillObject = {};
    for (const prop of Object.keys(target)) {
      fillObject[prop] = deepClone(target[prop]);
    }
    for (const prop of Object.keys(source)) {
      fillObject[prop] = coercePlayer(target[prop], source[prop]);
    }
    return fillObject;
  };
  export const savePlayer = () => {
    localStorage.setItem(storageKey, JSON.stringify(player));
  };
  const fixMachines = () => {
    for (const town of Object.values(player.towns)) {
      for (const machine of Object.values(town.machines)) {
        const type = MachineTypes[machine.type];
        if (type.upgrades.length) {
          if (!machine.upgrades) machine.upgrades = [];
          for (let i = 0; i < type.upgrades.length; i++) {
            if (!(i in machine.upgrades)) machine.upgrades[i] = 0;
          }
        }
        if (type.inputs.length) {
          if (!machine.inputs) machine.inputs = [];
          for (let i = 0; i < type.inputs.length; i++) {
            if (!(i in machine.inputs)) machine.inputs[i] = [];
          }
        }
        if (type.outputs.length) {
          if (!machine.outputs) machine.outputs = [];
          for (let i = 0; i < type.outputs.length; i++) {
            if (!(i in machine.outputs)) machine.outputs[i] = [];
          }
        }
      }
    }
  };
}

declare global {
  interface Window {
    player: _player_save;
    saveInterval: number;
  }
}

export let player = (window.player = Player.defaultStart());

Player.load();

window.saveInterval = setInterval(() => Player.savePlayer(), 10000);
