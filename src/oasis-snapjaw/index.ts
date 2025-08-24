/*
Oasis Snapjaw
His dreams of flying and breathing fire like his idol will never be realized.

Type: Minion
Minion Type: Beast
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Ittoku
Collectible
*/

import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel, RaceType } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('oasis-snapjaw')
export class OasisSnapjawModel extends CardModel {
    constructor(props: OasisSnapjawModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Oasis Snapjaw',
                desc: '',
                isCollectible: true,
                flavorDesc: 'His dreams of flying and breathing fire like his idol will never be realized.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 4 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 7 }}),   
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 