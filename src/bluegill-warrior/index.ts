// Bluegill Warrior
// He just wants a hug. A sloppy... slimy... hug.
// Charge
// Type: Minion
// Minion Type: Murloc
// Rarity: Free
// Set: Legacy
// Class: Neutral
// Artist: Jakub Kasper
// Collectible
// Learn More:
// Charge

import { ChargeModel, HealthModel, AttackModel, MinionModel, RaceType, RoleModel, RoleEntriesModel, ClassType, RarityType } from "hearthstone-core";
import { CostModel } from "hearthstone-core";

export class BluegillWarriorModel extends MinionModel {
    constructor(props: BluegillWarriorModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Bluegill Warrior',
                desc: 'Charge',
                races: [RaceType.MURLOC],
                flavorDesc: 'He just wants a hug. A sloppy... slimy... hug.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                        entries: new RoleEntriesModel({
                            child: {
                                charge: new ChargeModel({})
                            }
                        })
                    },
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 