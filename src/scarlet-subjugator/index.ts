/**
 * Scarlet Subjugator
 * 
 * "At the Scarlet Monastery, he learned the sacred art of kicking people when they're up."
 * 
 * Battlecry: Give an enemy minion -2 Attack until your next turn.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Adam Byrne
 * Collectible
 * 
 * 1/2/1
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionHooksModel, RoleAttackModel, RoleHealthModel, RoleModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { ScarletSubjugatorBattlecryModel } from "./battlecry";

@LibraryUtil.is('scarlet-subjugator')
export class ScarletSubjugatorModel extends MinionCardModel {
    constructor(loader?: Loader<ScarletSubjugatorModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Scarlet Subjugator',
                    desc: 'Battlecry: Give an enemy minion -2 Attack until your next turn.',
                    flavorDesc: '"At the Scarlet Monastery, he learned the sacred art of kicking people when they\'re up."',
                    isCollectible: true,
                    rarity: RarityType.RARE,
                    class: ClassType.PRIEST,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 2 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 1 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { battlecry: [new ScarletSubjugatorBattlecryModel()]}
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
