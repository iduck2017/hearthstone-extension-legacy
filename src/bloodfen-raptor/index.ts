// Bloodfen Raptor
// "Kill 30 raptors." - Hemet Nesingwary
// Type: Minion
// Minion Type: Beast
// Rarity: Free
// Set: Legacy
// Class: Neutral
// Artist: Dan Brereton
// Collectible

import { AttackModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";

export class BloodfenRaptorModel extends MinionModel {
    constructor(props: BloodfenRaptorModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Bloodfen Raptor',
                desc: '',
                races: [RaceType.BEAST],
                flavorDesc: '"Kill 30 raptors." - Hemet Nesingwary',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 3 }}),
                        health: new HealthModel({ state: { origin: 2 }}), 
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 