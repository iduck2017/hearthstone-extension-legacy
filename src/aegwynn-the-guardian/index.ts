/**
 * Aegwynn, the Guardian
 * With Medivh as her son, nothing YOU do could ever disappoint her.
 * 
 * Spell Damage +2 Deathrattle: The next minion you draw inherits these powers.
 * 
 * Type: Minion
 * Rarity: Legendary
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 1600 / 3200 (Golden)
 * Disenchanting Yield: 400 / 1600 (Golden)
 * Artist: Luke Mancini
 * Collectible
 */
import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RarityType, RoleModel, SpellBuffModel, RoleFeatsModel, MinionHooksModel, LibraryUtil, CostModel } from "hearthstone-core";
import { AegwynnTheGuardianDeathrattleModel } from "./deathrattle";
import { Loader } from "set-piece";

@LibraryUtil.is('aegwynn-the-guardian')
export class AegwynnTheGuardianModel extends MinionCardModel {
    constructor(loader?: Loader<AegwynnTheGuardianModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Aegwynn, the Guardian',
                    desc: 'Spell Damage +2 Deathrattle: The next minion you draw inherits these powers.',
                    isCollectible: true,
                    flavorDesc: 'With Medivh as her son, nothing YOU do could ever disappoint her.',
                    rarity: RarityType.LEGENDARY,
                    class: ClassType.MAGE,
                    races: [],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 5 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 5 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 5 }})), 
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: {
                            deathrattle: [new AegwynnTheGuardianDeathrattleModel()]
                        }
                    })),
                    feats: [new SpellBuffModel(() => ({ state: { offset: 2 }}))],
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
}
