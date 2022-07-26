export type _elements = "earth" | "water" | "clay" | "coal";
export type _machine_names = "cisthern" | "quarry" | "shoveller";
export type _resource = {
  resource: _elements;
  amount: number;
};
export type _towns = "home";

export type _player_save = {
  money: number;
  towns: {
    [key in _towns]: {
      machines: { [key: number]: _save_machine };
    };
  };
  currentlyIn: _towns;
  holding: _resource;
  display: {
    offset: { x: number; y: number };
  };
};

export type _output = {
  produces: {
    resource: _elements;
    amount: (machine?: _machine) => number;
  };
  isUnlocked?: (machine: _machine) => boolean;
  capacity: (machine?: _machine) => number;
};

export interface _machine {}
export interface _machine {
  type: _machine_names;
  x: number;
  y: number;
  inputs?: _resource[];
  outputs: _output[];
}

export interface _save_machine {
  type: _machine_names;
  x: number;
  y: number;
  inputs?: _resource[];
  outputs: _output[];
  upgrades: { [id: number]: number };
}

interface _basic_machine extends _machine {
  upgrades: { [key in _basic_upgrades]: number };
}

export type __upgrade = { [key: string]: number };

export type _basic_upgrades = "velocity" | "capacity";

export interface _upgrade {
  name: string;
  cost: number;
  max: number;
  title: string;
  description: string;
  effect: (count: number) => number;
  formatEffect?: (effect: boolean) => "Unlocked" | "Not unlocked"; // is it like this only for unlock upgrades?
}
// export class machine_class<town extends _towns, id extends number> {}
