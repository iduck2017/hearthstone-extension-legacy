
/**
 * Murloc Tidehunter
 * 
 * "Death will rise, from the tides!"
 * 
 * Battlecry: Summon a 1/1 Murloc Scout.
 * 
 * Type: Minion
 * Minion Type: Murloc
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Dan Scott
 * Collectible
 */

import { CardModel, ClassType, RoleHealthModel, MinionCardModel, MinionHooksModel, RaceType, RarityType, RoleAttackModel, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";
import { MurlocTidehunterBattlecryModel } from "./battlecry";

@LibraryUtil.is('murloc-tidehunter')
export class MurlocTidehunterModel extends MinionCardModel {
    constructor(loader?: Loader<MurlocTidehunterModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Murloc Tidehunter',
                    desc: 'Battlecry: Summon a 1/1 Murloc Scout.',
                    isCollectible: true,
                    flavorDesc: '"Death will rise, from the tides!"',
                    rarity: RarityType.COMMON,
                    races: [RaceType.MURLOC],
                    class: ClassType.NEUTRAL,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    role: new RoleModel(() => ({
                        state: { races: [RaceType.MURLOC] },
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 2 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 1 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { battlecry: [new MurlocTidehunterBattlecryModel()] }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
