/*
 * Ironfur Grizzly 3/3/3
 * "Bear Carcass 1/10"
 * Taunt
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Lars Grant-West
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType, TauntModel } from "hearthstone-core";

@LibraryUtil.is('ironfur-grizzly')
export class IronfurGrizzlyModel extends MinionCardModel {
    constructor(props?: IronfurGrizzlyModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ironfur Grizzly',
                desc: 'Taunt',
                flavorDesc: '"Bear Carcass 1/10"',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                taunt: props.child?.taunt ?? new TauntModel(),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
