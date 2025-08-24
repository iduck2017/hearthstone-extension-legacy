/*
River Crocolisk
Edward "Lefty" Smith tried to make luggage out of a river crocolisk once.

Type: Minion
Minion Type: Beast
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Daren Bader
Collectible
*/

import { AttackModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel, CardModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('river-crocolisk')
export class RiverCrocoliskModel extends CardModel {
    constructor(props: RiverCrocoliskModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'River Crocolisk',
                desc: '',
                isCollectible: true,
                flavorDesc: 'Edward "Lefty" Smith tried to make luggage out of a river crocolisk once.',
                rarity: RarityType.FREE,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 3 }}), 
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
} 