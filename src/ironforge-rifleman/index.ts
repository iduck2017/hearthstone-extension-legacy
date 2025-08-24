/*
Ironforge Rifleman
"Ready! Aim! Drink!"

Battlecry: Deal 1 damage.

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Tooth
Collectible
*/

import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel } from "hearthstone-core";
import { IronforgeRiflemanBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('ironforge-rifleman')
export class IronforgeRiflemanModel extends CardModel {
    constructor(props: IronforgeRiflemanModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Ironforge Rifleman',
                desc: 'Battlecry: Deal 1 damage.',
                isCollectible: true,
                flavorDesc: 'Ready! Aim! Drink!',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 2 }}),   
                    }
                }),
                hooks: new CardHooksModel({
                    child: { battlecry: [
                        new IronforgeRiflemanBattlecryModel({})
                    ]}
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 