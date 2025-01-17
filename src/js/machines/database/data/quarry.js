import { machineUpg } from "../init";

import { GameDatabase } from "@/js/database/index";

GameDatabase.machines.quarry = {
	name: "quarry",
	inputs: [],
	outputs: [{
		capacity: machine => 10 * machine.upgrades.capacity.effect,
		produces: machine => ({
			resource: "stone",
			amount: 0.15 * machine.upgrades.velocity.effect
		}),
		isUnlocked: machine => machine.upgrades.unlock.maxed
	},
	{
		capacity: machine => 5 * machine.upgrades.capacity.effect,
		produces: machine => ({
			resource: "coal",
			amount: 0.04 * machine.upgrades.velocity.effect
		}),
		isUnlocked: machine => machine.upgrades.unlock.maxed
	}],
	upgrades: machineUpg([{
		name: "unlock",
		cost: 55,
		currencyType: "bricks",
		max: 1,
		title: "Build",
		description: "Build the quarry.",
		effect: count => Boolean(count),
		formatEffect: () => "",
		isUnlocked: machine => !machine.upgrades.unlock.effect
	},
	{
		name: "capacity",
		cost: count => Math.pow(4, count) * 10,
		currencyType: "energy",
		max: 4,
		title: "Capacity",
		description: "Increase Stone and Coal capacity",
		effect: count => Math.pow(2, count),
		isUnlocked: machine => machine.upgrades.unlock.effect
	},
	{
		name: "velocity",
		cost: count => (count > 4 ? Math.pow(4, count - 5) * 10 : Math.pow(3, count) * 10),
		currencyType: count => (count > 4 ? "vitriol" : "energy"),
		max: 8,
		title: "Velocity",
		description: "Increase Stone and Coal production",
		effect: count => Math.pow(1.55, count) + count * 0.1,
		isUnlocked: machine => machine.upgrades.unlock.effect
	}]),
	description: `Produces Stone and Coal.`
};