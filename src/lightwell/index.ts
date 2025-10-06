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

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeatsModel, RoleAttackModel, RoleHealthModel, RoleModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { LightwellEndTurnModel } from "./end-turn";

@LibraryUtil.is('lightwell')
export class LightwellModel extends MinionCardModel {
    constructor(loader?: Loader<LightwellModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
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
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 0 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 5 }})),
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { endTurn: [new LightwellEndTurnModel()]}
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
