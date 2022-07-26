import { GameDatabase } from "../game-database";
import { _machine } from "../types";

import { machineUpg } from "./init";

GameDatabase.machines.shoveller = {
  name: "shoveller",
  inputs: [],
  outputs: [
    {
      capacity: (machine) => 10 * machine.upgrades.capacity.effect,

      produces: {
        resource: "earth",
        amount: (machine: _machine) => 0.3 * machine.upgrades.velocity.effect,
      },
    },
  ],
  upgrades: machineUpg([
    {
      name: "capacity",
      cost: 10,
      max: 1,
      title: "Capacity",
      effect: (count) => count * 2 + 1,
      description: "Incrcease capacity",
    },
    {
      name: "velocity",
      cost: 10,
      max: 2,
      title: "Velocity",
      effect: (count) => Math.pow(1.5, count) + count,
      description: "Increase production",
    },
  ]),
  description: `Produces Earth.`,
};
