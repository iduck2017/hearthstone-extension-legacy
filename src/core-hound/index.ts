/*
Core Hound
You don't tame a Core Hound. You just train it to eat someone else before it eats you.

Type: Minion
Minion Type: Beast
Rarity: Free
Set: Legacy
Class: Neutral
Artist: E. M. Gist
Collectible
*/

import { MinionModel, HealthModel, AttackModel, RoleModel, ClassType, RarityType, CardModel, RaceType } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('core-hound')
export class CoreHoundModel extends CardModel {
    constructor(props: CoreHoundModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Core Hound',
                desc: '',
                isCollectible: true,
                flavorDesc: 'You don\'t tame a Core Hound. You just train it to eat someone else before it eats you.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 7 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
                    child: {
                        attack: new AttackModel({ state: { origin: 9 }}),
                        health: new HealthModel({ state: { origin: 5 }}),
                    },
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 