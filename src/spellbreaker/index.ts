/*
 * Spellbreaker 4/4/3
 * Spellbreakers can rip enchantments from magic-wielders. The process is painless and can be performed on an outpatient basis.
 * Battlecry: Silence a minion.
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Matt Cavotta
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { Loader } from "set-piece";
import { SpellbreakerBattlecryModel } from "./battlecry";

@LibraryUtil.is('spellbreaker')
export class SpellbreakerModel extends MinionCardModel {
    constructor(loader?: Loader<SpellbreakerModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Spellbreaker',
                    desc: 'Battlecry: Silence a minion.',
                    flavorDesc: 'Spellbreakers can rip enchantments from magic-wielders. The process is painless and can be performed on an outpatient basis.',
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
                            health: new RoleHealthModel(() => ({ state: { origin: 3 }})),
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: [new SpellbreakerBattlecryModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
