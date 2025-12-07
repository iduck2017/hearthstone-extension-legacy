/*
 * Mechanical Dragonling 1/2/1
 * Type: Minion
 * Minion Type: Dragon
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Warren Mahy
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";

@LibraryService.is('mechanical-dragonling')
export class MechanicalDragonlingModel extends MinionCardModel {
    constructor(props?: MechanicalDragonlingModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Mechanical Dragonling',
                desc: '',
                flavorDesc: '',
                isCollectible: false,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.DRAGON],
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
