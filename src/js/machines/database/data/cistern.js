import { machineUpg } from "../init";

import { GameDatabase } from "@/js/database/index";

GameDatabase.machines.cistern = {
	name: "cistern",
	inputs: [],
	outputs: [{
		capacity: machine => 8 * machine.upgrades.capacity.effect,
		produces: machine => ({
			resource: "water",
			amount: 0.2 * machine.upgrades.velocity.effect
		}),
		isUnlocked: machine => machine.upgrades.unlock.maxed
	}],
	upgrades: machineUpg([{
		name: "unlock",
		cost: 1,
		max: 1,
		title: "Unlock",
		description: "Unlock the cistern",
		effect: count => Boolean(count),
		formatEffect: () => "",
		isUnlocked: machine => !machine.upgrades.unlock.effect
	},
	{
		name: "capacity",
		cost: count => Math.pow(5, count) * 25,
		max: 5,
		title: "Capacity",
		description: "Incrcease Water capacity",
		effect: count => Math.pow(2, count - 1) + count + 0.5,
		isUnlocked: machine => machine.upgrades.unlock.effect
	},
	{
		name: "velocity",
		cost: count => Math.pow(4, count) * 30,
		max: 6,
		title: "Velocity",
		description: "Increase Water production",
		effect: count => Math.pow(1.5, count) + 1.5 * count,
		isUnlocked: machine => machine.upgrades.unlock.effect
	}]),
	description: `Produces Water.`
};