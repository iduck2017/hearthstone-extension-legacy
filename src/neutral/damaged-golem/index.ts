/*
 * Damaged Golem 1/2/1
 * Type: Minion
 * Minion Type: Mech
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Brian Despain
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";

@LibraryService.is('damaged-golem')
export class DamagedGolemModel extends MinionCardModel {
    constructor(props?: DamagedGolemModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Damaged Golem',
                desc: '',
                flavorDesc: '',
                isCollectible: false,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.MECH],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
