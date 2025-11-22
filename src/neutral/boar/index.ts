/*
 * Boar 1/1/1
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Collectible: false
 */
import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";

@LibraryUtil.is('boar')
export class BoarModel extends MinionCardModel {
    constructor(props?: BoarModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Boar',
                desc: '',
                flavorDesc: '',
                isCollectible: false,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
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
