/*
Injured Blademaster
He claims it is an old war wound, but we think he just cut himself shaving.

Battlecry: Deal 4 damage to HIMSELF.

Type: Minion
Rarity: Rare
Set: Legacy
Class: Neutral
Cost to Craft: 100 / 800 (Golden)
Disenchanting Yield: 20 / 100 (Golden)
Artist: Samwise
Collectible
*/

import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel } from "hearthstone-core";
import { InjuredBlademasterBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('injured-blademaster')
export class InjuredBlademasterModel extends CardModel {
    constructor(props: InjuredBlademasterModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Injured Blademaster',
                desc: 'Battlecry: Deal 4 damage to HIMSELF.',
                isCollectible: true,
                flavorDesc: 'He claims it is an old war wound, but we think he just cut himself shaving.',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 4 }}),
                        health: new HealthModel({ state: { origin: 7 }}),   
                    }
                }),
                hooks: new CardHooksModel({
                    child: { battlecry: [
                        new InjuredBlademasterBattlecryModel({})
                    ]}
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 