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

import { MinionCardModel, RoleHealthModel, RoleAttackModel, RaceType, RarityType, ClassType, LibraryUtil, CostModel, MinionFeaturesModel } from "hearthstone-core";

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
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { battlecry: [] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}   