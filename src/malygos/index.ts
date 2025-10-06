/*
 * Malygos 9/4/12
 * Malygos hates it when mortals use magic. He gets so mad!
 * Spell Damage +5
 * Type: Minion
 * Minion Type: Dragon
 * Rarity: Legendary
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 1600 / 3200 (Golden)
 * Disenchanting Yield: 400 / 1600 (Golden)
 * Artist: Michael Komarck
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, SpellBuffModel } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('malygos')
export class MalygosModel extends MinionCardModel {
    constructor(loader?: Loader<MalygosModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Malygos',
                    desc: 'Spell Damage +5',
                    flavorDesc: 'Malygos hates it when mortals use magic. He gets so mad!',
                    isCollectible: true,
                    rarity: RarityType.LEGENDARY,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.DRAGON],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 9 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 4 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 12 }})),
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: [], 
                            items: [new SpellBuffModel(() => ({ state: { offset: 5 }}))]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
