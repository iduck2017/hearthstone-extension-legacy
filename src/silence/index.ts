/**
 * Silence
 * Reserved for enemy spellcasters, evil liches from beyond the grave, and karaoke nights at the Grim Guzzler.
 * 
 * Silence a minion.
 * 
 * Type: Spell
 * Spell School: Shadow
 * Rarity: Common
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Zoltan & Gabor
 * Collectible
 */
import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeatsModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { SilenceEffectModel } from "./effect";

@LibraryUtil.is('silence')
export class SilenceModel extends SpellCardModel {
    constructor(loader?: Loader<SilenceModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Silence",
                    desc: "Silence a minion.",
                    flavorDesc: "Reserved for enemy spellcasters, evil liches from beyond the grave, and karaoke nights at the Grim Guzzler.",
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.PRIEST,
                    schools: [SchoolType.SHADOW],
                    ...props.state
                },
                refer: { ...props.refer },
                child: {
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { origin: 0 }})),
                    feats: props.child?.feats ?? new SpellFeatsModel(() => ({
                        child: { effects: [new SilenceEffectModel()] }
                    })),
                    ...props.child
                }
            };
        });
    }
}
