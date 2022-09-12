import { Machine } from "../../logic";

import { defineMachine } from "../builder";

import {
	ConfiguredMachineWithUpgrades,
	getConsumption,
	getEnergyUsage,
	getProduction,
	mapRecipesByInput,
} from "../utils";

import { Currencies } from "@/js/currencies/currencies";

import { MaybeResourceType, Recipe, ResourceType } from "@/types/resources";
import { run } from "@/utils";

const recipes: Recipe<ConfiguredMachineWithUpgrades<"power">>[] = [
	{
		input: { resource: "coal", amount: 0.3 },
		output: { resource: "fire", amount: 0.2 },
		energyUsage: 0.3,
	},
	{
		input: { resource: "energy", amount: 0.25 },
		output: { resource: "essence", amount: 0.02 },
		energyUsage: 0.15,
	},
	{
		input: { resource: "lava", amount: 0.2 },
		output: { resource: "vitriol", amount: 0.08 },
		energyUsage: 0.5,
		isUnlocked: machine => machine.upgrades.power.count > 0,
	},
	{
		input: { resource: "glass", amount: 1 },
		output: { resource: "purity", amount: 0.01 },
		energyUsage: 0.5,
		isUnlocked: machine => machine.upgrades.power.count > 1,
	},
	{
		input: { resource: "none", amount: 0 },
		output: { resource: "earth", amount: 0 },
		energyUsage: 0,
	},
];

const recipesByInput = mapRecipesByInput(recipes);

export default defineMachine({
	name: "essencePurifier",
	meta: () => ({
		inputResource: "none" as MaybeResourceType
	}),
	inputs: [
		{
			accepts: machine =>
				recipes
					.filter(x => (x.isUnlocked ? run(x.isUnlocked, machine) : true))
					.map(x => x.input.resource)
					.filter(x => x !== "none") as ResourceType[],
			capacity: machine => 5 * machine.upgrades.capacity.effect,
			consumes: machine => {
				const prod = getConsumption(machine, recipesByInput);
				return {
					amount: prod,
					maximum: machine.outputDiffs.main * prod,
				};
			},
			isUnlocked: machine => Boolean(machine.upgrades.unlock.effect),
		},
		{
			accepts: ["energy"],
			capacity: machine => 5 * machine.upgrades.capacity.effect,
			consumes: machine => {
				const prod = getEnergyUsage(machine, recipesByInput);
				return {
					amount: prod,
					maximum: machine.outputDiffs.main * prod,
				};
			},
			isUnlocked: machine => Boolean(machine.upgrades.unlock.effect),
		},
	],
	outputs: [
		{
			id: "main",
			capacity: machine => 5 * machine.upgrades.capacity.effect,
			produces: machine => getProduction(machine, recipesByInput),
			requiresList: machine => [
				{
					resource: machine.meta.inputResource || "none",
					amount: getConsumption(machine, recipesByInput),
					inputId: 0,
				},
				{
					resource: "energy",
					amount: getEnergyUsage(machine, recipesByInput),
					inputId: 1,
				},
			],
			isUnlocked: machine => Boolean(machine.upgrades.unlock.effect),
		},
	],
	upgrades: {
		unlock: {
			name: "unlock",
			cost: 150,
			currencyType: () => (Currencies.energy.isUnlocked ? "energy" : undefined),
			max: 1,
			title: "Power",
			description: "Supply Power to the EssencePurifier.",
			effect: count => Boolean(count),
			formatEffect: () => "",
			isUnlocked: machine => !machine.upgrades.unlock.effect,
		},
		velocity: {
			name: "velocity",
			cost: count => Math.pow(2.5, count) * 30,
			currencyType: "lava",
			max: 4,
			title: "Efficiency",
			description: "Increase operation speed without increasing energy usage in Input 2",
			effect: count => Math.pow(1.5, count) + count * 0.2,
			isUnlocked: machine => Boolean(machine.upgrades.unlock.effect),
		},
		power: {
			name: "power",
			cost: count => Math.pow(2, count) * 40,
			currencyType: "essence",
			max: 2,
			title: "Power",
			description: "Increase the power level to extract essences from 1 more type of raw material",
			effect: count => count,
			formatEffect: () => "",
			isUnlocked: machine => Boolean(machine.upgrades.unlock.effect),
		},
		capacity: {
			name: "capacity",
			cost: count => Math.pow(4, count) * 20,
			max: 2,
			currencyType: "vitriol",
			title: "Capacity",
			description: "Increase capacity",
			effect: count => Math.pow(2, count - 1) + count + 0.5,
			isUnlocked: machine =>
				Boolean(
					machine.upgrades.unlock.effect &&
						(machine.upgrades.power.count || Currencies.vitriol.isUnlocked)
				),
		},
	},
	customLoop(diff) {
		this.meta.inputResource = this.inputItem(0) ? this.inputItem(0).resource : "none";
		Machine.tickThisMachine(this, diff);
	},
	description: `Extracts Basic Essences from raw materials.`,
});