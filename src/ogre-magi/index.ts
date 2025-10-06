/*
 * Ogre Magi 4/4/4
 * Training Ogres in the art of spellcasting is a questionable decision.
 * Spell Damage +1
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: James Ryman
 * Collectible
 */
import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, SpellBuffModel } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('ogre-magi')
export class OgreMagiModel extends MinionCardModel {
    constructor(loader?: Loader<OgreMagiModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Ogre Magi',
                    desc: 'Spell Damage +1',
                    flavorDesc: 'Training Ogres in the art of spellcasting is a questionable decision.',
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 4 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 4 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 4 }})),
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: [],
                            spellBuff: new SpellBuffModel(() => ({ state: { offset: 1 }}))
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
