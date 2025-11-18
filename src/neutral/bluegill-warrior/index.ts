/*
 * Bluegill Warrior
 * He just wants a hug. A sloppy... slimy... hug.
 * Charge
 * Type: Minion
 * Minion Type: Murloc
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Jakub Kasper
 * Collectible
 * Learn More:
 * Charge
 */

import { ChargeModel, RoleHealthModel, RoleAttackModel, MinionCardModel, RaceType, ClassType, RarityType, CostModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('bluegill-warrior')
export class BluegillWarriorModel extends MinionCardModel {
    constructor(props?: BluegillWarriorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Bluegill Warrior',
                desc: 'Charge',
                collectible: true,
                flavorDesc: 'He just wants a hug. A sloppy... slimy... hug.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.MURLOC],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                charge: props.child?.charge ?? new ChargeModel({ state: { actived: true } }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 