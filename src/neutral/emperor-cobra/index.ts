/*
 * Emperor Cobra 3/2/3
 * The Sholazar Basin is home to a lot of really horrible things. If you're going to visit, wear bug spray. And plate armor.
 * Poisonous
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Lars Grant-West
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType, PoisonousModel } from "hearthstone-core";

@LibraryService.is('emperor-cobra')
export class EmperorCobraModel extends MinionCardModel {
    constructor(props?: EmperorCobraModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Emperor Cobra',
                desc: 'Poisonous',
                flavorDesc: 'The Sholazar Basin is home to a lot of really horrible things. If you\'re going to visit, wear bug spray. And plate armor.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                poisonous: props.child?.poisonous ?? new PoisonousModel(),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
