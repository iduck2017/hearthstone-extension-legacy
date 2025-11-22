/*
 * Chillwind Yeti 4/4/5
 * He always dreamed of coming down from the mountains and opening a noodle shop, but he never got the nerve.
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Mauro Cascioli
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";

@LibraryUtil.is('chillwind-yeti')
export class ChillwindYetiModel extends MinionCardModel {
    constructor(props?: ChillwindYetiModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Chillwind Yeti',
                desc: '',
                flavorDesc: 'He always dreamed of coming down from the mountains and opening a noodle shop, but he never got the nerve.',
                collectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
