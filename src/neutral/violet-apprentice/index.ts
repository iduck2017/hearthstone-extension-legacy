/*
 * Violet Apprentice 1/1/1
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: James Ryman
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";

@LibraryUtil.is('violet-apprentice')
export class VioletApprenticeModel extends MinionCardModel {
    constructor(props?: VioletApprenticeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Violet Apprentice',
                desc: '',
                flavorDesc: '',
                collectible: false,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
