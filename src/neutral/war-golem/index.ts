/*
 * War Golem 7/7/7
 * Golems are not afraid, but for some reason they still run when you cast Fear on them. Instinct, maybe? A desire to blend in?
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Dave Kendall
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";

@LibraryUtil.is('war-golem')
export class WarGolemModel extends MinionCardModel {
    constructor(props?: WarGolemModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'War Golem',
                desc: '',
                flavorDesc: 'Golems are not afraid, but for some reason they still run when you cast Fear on them. Instinct, maybe? A desire to blend in?',
                collectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 7 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 7 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 7 }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
