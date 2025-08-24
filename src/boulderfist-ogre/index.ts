/*
Boulderfist Ogre
"ME HAVE GOOD STATS FOR THE COST"

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Brian Despain
Collectible
*/

import { MinionModel, HealthModel, AttackModel, RoleModel, ClassType, RarityType, CardModel, RaceType } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('boulderfist-ogre')
export class BoulderfistOgreModel extends CardModel {
    constructor(props: BoulderfistOgreModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Boulderfist Ogre',
                desc: '',
                isCollectible: true,
                flavorDesc: '"ME HAVE GOOD STATS FOR THE COST"',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 6 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 6 }}),
                        health: new HealthModel({ state: { origin: 7 }}),
                    },
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 