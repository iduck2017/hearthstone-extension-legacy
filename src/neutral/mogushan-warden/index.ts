/*
 * Mogu'shan Warden 4/1/7
 * All these guys ever do is talk about the Thunder King. BOOOORRRINNG!
 * Taunt
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Cole Eastburn
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType, TauntModel } from "hearthstone-core";

@LibraryUtil.is('mogushan-warden')
export class MogushanWardenModel extends MinionCardModel {
    constructor(props?: MogushanWardenModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Mogu\'shan Warden',
                desc: 'Taunt',
                flavorDesc: 'All these guys ever do is talk about the Thunder King. BOOOORRRINNG!',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 7 }}),
                taunt: props.child?.taunt ?? new TauntModel(),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
