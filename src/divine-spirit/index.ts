/**
 * Divine Spirit
 * 
 * "Double the trouble. Double the fun!"
 * 
 * Double a minion's Health.
 * 
 * Type: Spell
 * Spell School: Holy
 * Rarity: Common
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Jim Pavelec
 * Collectible
 * 
 * 2 cost
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel, SchoolType, SpellFeatsModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { DivineSpiritEffectModel } from "./effect";

@LibraryUtil.is('divine-spirit')
export class DivineSpiritModel extends SpellCardModel {
    constructor(loader?: Loader<DivineSpiritModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Divine Spirit',
                    desc: 'Double a minion\'s Health.',
                    flavorDesc: '"Double the trouble. Double the fun!"',
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.PRIEST,
                    schools: [SchoolType.HOLY],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    feats: props.child?.feats ?? new SpellFeatsModel(() => ({
                        child: { effects: [new DivineSpiritEffectModel()] }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
