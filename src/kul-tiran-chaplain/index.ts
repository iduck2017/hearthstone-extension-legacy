/**
 * Kul Tiran Chaplain
 * 
 * "The maritime Kul Tiran clergy are unique among priests for using holy saltwater."
 * 
 * Battlecry: Give a friendly minion +2 Health.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Vladimir Kafanov
 * Collectible
 * 
 * 2/3/2
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionHooksModel, RoleAttackModel, RoleHealthModel, RoleModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { KulTiranChaplainBattlecryModel } from "./battlecry";

@LibraryUtil.is('kul-tiran-chaplain')
export class KulTiranChaplainModel extends MinionCardModel {
    constructor(loader?: Loader<KulTiranChaplainModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Kul Tiran Chaplain',
                    desc: 'Battlecry: Give a friendly minion +2 Health.',
                    flavorDesc: '"The maritime Kul Tiran clergy are unique among priests for using holy saltwater."',
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
                            attack: new RoleAttackModel(() => ({ state: { origin: 2 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 3 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { battlecry: [new KulTiranChaplainBattlecryModel()]}
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
