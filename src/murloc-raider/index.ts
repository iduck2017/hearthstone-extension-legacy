/*
 * Murloc Raider
 * Mrrraggglhlhghghlgh, mrgaaag blarrghlgaahahl mrgggg glhalhah a bghhll graggmgmg Garrosh mglhlhlh mrghlhlhl!!
 * 
 * Type: Minion
 * Minion Type: Murloc
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { MinionCardModel, RoleHealthModel, RoleAttackModel, RaceType, RoleModel, RarityType, ClassType, LibraryUtil, CostModel } from "hearthstone-core";

@LibraryUtil.is('murloc-raider')
export class MurlocRaiderModel extends MinionCardModel {
    constructor(props?: MurlocRaiderModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Raider',
                desc: '',
                isCollectible: true,
                flavorDesc: 'Mrrraggglhlhghghlgh, mrgaaag blarrghlgaahahl mrgggg glhalhah a bghhll graggmgmg Garrosh mglhlhlh mrghlhlhl!!',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.MURLOC],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 1 }}),
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}   