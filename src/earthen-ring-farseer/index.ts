/*
Earthen Ring Farseer
He can see really far, and he doesn't use a telescope like those filthy pirates.

Battlecry: Restore 3 Health.

Type: Minion
Rarity: Common
Set: Legacy
Class: Neutral
Cost to Craft: 40 / 400 (Golden)
Disenchanting Yield: 5 / 50 (Golden)
Artist: Alex Horley Orlandelli
Collectible
*/

import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel } from "hearthstone-core";
import { EarthenRingFarseerBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('earthen-ring-farseer')
export class EarthenRingFarseerModel extends CardModel {
    constructor(props: EarthenRingFarseerModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Earthen Ring Farseer',
                desc: 'Battlecry: Restore 3 Health.',
                isCollectible: true,
                flavorDesc: 'He can see really far, and he doesn\'t use a telescope like those filthy pirates.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 3 }}),
                        health: new HealthModel({ state: { origin: 3 }}),   
                    }
                }),
                hooks: new CardHooksModel({
                    child: { battlecry: [
                        new EarthenRingFarseerBattlecryModel({})
                    ]}
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 