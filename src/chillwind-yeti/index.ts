/*
Chillwind Yeti
He always dreamed of coming down from the mountains and opening a noodle shop, but he never got the nerve.

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Mauro Cascioli
Collectible
*/

import { MinionModel, HealthModel, AttackModel, RoleModel, ClassType, RarityType, CardModel, RaceType } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('chillwind-yeti')
export class ChillwindYetiModel extends CardModel {
    constructor(props: ChillwindYetiModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Chillwind Yeti',
                desc: '',
                isCollectible: true,
                flavorDesc: 'He always dreamed of coming down from the mountains and opening a noodle shop, but he never got the nerve.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 4 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 4 }}),
                        health: new HealthModel({ state: { origin: 5 }}),
                    },
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 