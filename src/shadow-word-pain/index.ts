/**
 * Shadow Word: Pain
 * 
 * "A step up from a spell cast by many beginning acolytes: 'Shadow Word: Annoy'."
 * 
 * Destroy a minion with 3 or less Attack.
 * 
 * Type: Spell
 * Spell School: Shadow
 * Rarity: Free
 * Set: Legacy
 * Class: Priest
 * Artist: Raymond Swanland
 * Collectible
 * 
 * 2 cost
 */
import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel, SchoolType } from "hearthstone-core";
import { Loader } from "set-piece";
import { ShadowWordPainEffectModel } from "./effect";

@LibraryUtil.is('shadow-word-pain')
export class ShadowWordPainModel extends SpellCardModel {
    constructor(loader?: Loader<ShadowWordPainModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Shadow Word: Pain',
                    desc: 'Destroy a minion with 3 or less Attack.',
                    flavorDesc: '"A step up from a spell cast by many beginning acolytes: \'Shadow Word: Annoy\'."',
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.PRIEST,
                    schools: [SchoolType.SHADOW],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    effects: props.child?.effects ?? [new ShadowWordPainEffectModel()],
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
