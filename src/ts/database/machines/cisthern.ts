import { _machine } from "../types";
import { GameDatabase } from "../game-database";

GameDatabase.machines.cistern = {
  type: "cisthern",
  // isUnlocked: (machine:_machine) => machine.upgrades.unlock.maxed,

  inputs: [],
  outputs: [
    {
      produces: {
        resource: "water",
        amount: () => 0.15,
      },
      capacity: () => 5,
    },
  ],
  upgrades: machineUpg([
    {
      name: "unlock",
      cost: 2,
      max: 1,
      title: "Unlock",
      description: "Unlock the cistern",
      effect: (count) => Boolean(count),
      formatEffect: (effect) => (effect ? "Unlocked" : "Not unlocked"),
    },
  ]),

  description: `Produces Water.`,
};
