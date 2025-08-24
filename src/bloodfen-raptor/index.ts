// Bloodfen Raptor
// "Kill 30 raptors." - Hemet Nesingwary
// Type: Minion
// Minion Type: Beast
// Rarity: Free
// Set: Legacy
// Class: Neutral
// Artist: Dan Brereton
// Collectible

import { AttackModel, CardModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('bloodfen-raptor')
export class BloodfenRaptorModel extends CardModel {
    constructor(props: BloodfenRaptorModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Bloodfen Raptor',
                desc: '',
                flavorDesc: '"Kill 30 raptors." - Hemet Nesingwary',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
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