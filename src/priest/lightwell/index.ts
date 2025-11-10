/**
 * Lightwell
 * 
 * "It isn't clear if people ignore the Lightwell, or if it is just invisible."
 * 
 * At the start of your turn, restore 3 Health to a damaged friendly character.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Blizzard Entertainment
 * Collectible
 * 
 * 2/0/5
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { LightwellEndTurnModel } from "./end-turn";

@LibraryUtil.is('lightwell')
export class LightwellModel extends MinionCardModel {
    constructor(props?: LightwellModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Lightwell',
                desc: 'At the start of your turn, restore 3 Health to a damaged friendly character.',
                flavorDesc: '"It isn\'t clear if people ignore the Lightwell, or if it is just invisible."',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PRIEST,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 0 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { endTurn: [new LightwellEndTurnModel()]}
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
