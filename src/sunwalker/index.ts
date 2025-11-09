/*
 * Sunwalker
 * She doesn't ACTUALLY walk on the Sun. It's just a name. Don't worry!
 * Taunt Divine Shield
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Andrea Uderzo
 * Collectible
 */

import { TauntModel, RoleHealthModel, RoleAttackModel, MinionCardModel, MinionFeaturesModel, ClassType, RarityType, DivineShieldModel, CostModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('sunwalker')
export class SunwalkerModel extends MinionCardModel {
    constructor(props?: SunwalkerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Sunwalker',
                desc: 'Taunt Divine Shield',
                isCollectible: true,
                flavorDesc: 'She doesn\'t ACTUALLY walk on the Sun. It\'s just a name. Don\'t worry!',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 6 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        taunt: new TauntModel(),
                        divineShield: new DivineShieldModel()
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
