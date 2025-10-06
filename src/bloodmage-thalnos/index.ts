/*
 * Bloodmage Thalnos
 * He's in charge of the Annual Scarlet Monastery Blood Drive!
 * Spell Damage +1 Deathrattle: Draw a card.
 * Type: Minion
 * Minion Type: Undead
 * Rarity: Legendary
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 1600 / 3200 (Golden)
 * Disenchanting Yield: 400 / 1600 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RaceType, RarityType, RoleModel, SpellBuffModel, RoleFeatsModel, MinionHooksModel, LibraryUtil, CostModel } from "hearthstone-core";
import { BloodmageThalnosDeathrattleModel } from "./deathrattle";
import { Loader } from "set-piece";

@LibraryUtil.is('bloodmage-thalnos')
export class BloodmageThalnosModel extends MinionCardModel {
    constructor(loader?: Loader<BloodmageThalnosModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Bloodmage Thalnos',
                    desc: 'Spell Damage +1 Deathrattle: Draw a card.',
                    isCollectible: true,
                    flavorDesc: 'He\'s in charge of the Annual Scarlet Monastery Blood Drive!',
                    rarity: RarityType.LEGENDARY,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.UNDEAD],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 1 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 1 }})), 
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: {
                            deathrattle: [new BloodmageThalnosDeathrattleModel()]
                        }
                    })),
                    feats: [new SpellBuffModel(() => ({ state: { offset: 1 }}))],
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
} 