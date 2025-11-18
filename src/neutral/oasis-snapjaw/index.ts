/*
 * Oasis Snapjaw 4/2/7
 * His dreams of flying and breathing fire like his idol will never be realized.
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Ittoku
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";

@LibraryUtil.is('oasis-snapjaw')
export class OasisSnapjawModel extends MinionCardModel {
    constructor(props?: OasisSnapjawModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Oasis Snapjaw',
                desc: '',
                flavorDesc: 'His dreams of flying and breathing fire like his idol will never be realized.',
                collectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 7 }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
