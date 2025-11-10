/*
 * Squire 1/2/2
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Matt Starbuck
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeaturesModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";

@LibraryUtil.is('squire')
export class SquireModel extends MinionCardModel {
    constructor(props?: SquireModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Squire',
                desc: '',
                flavorDesc: '',
                isCollectible: false,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
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
