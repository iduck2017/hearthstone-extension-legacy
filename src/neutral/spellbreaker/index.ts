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

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeaturesModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { SpellbreakerBattlecryModel } from "./battlecry";

@LibraryUtil.is('spellbreaker')
export class SpellbreakerModel extends MinionCardModel {
    constructor(props?: SpellbreakerModel['props']) {
        props = props ?? {};
        super({
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
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { 
                        battlecry: [new SpellbreakerBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
