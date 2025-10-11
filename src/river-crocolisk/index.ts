/*
 * River Crocolisk 2/2/3
 * Edward "Lefty" Smith tried to make luggage out of a river crocolisk once.
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Daren Bader
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";

@LibraryUtil.is('river-crocolisk')
export class RiverCrocoliskModel extends MinionCardModel {
    constructor(props?: RiverCrocoliskModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'River Crocolisk',
                desc: '',
                flavorDesc: 'Edward "Lefty" Smith tried to make luggage out of a river crocolisk once.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 3 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeatsModel({
                    child: { 
                        battlecry: []
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
