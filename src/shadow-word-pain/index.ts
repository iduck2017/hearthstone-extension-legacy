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
import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel, SchoolType, SpellFeatsModel } from "hearthstone-core";
import { ShadowWordPainEffectModel } from "./effect";

@LibraryUtil.is('shadow-word-pain')
export class ShadowWordPainModel extends SpellCardModel {
    constructor(props?: ShadowWordPainModel['props']) {
        props = props ?? {};
        super({
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
                cost: new CostModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new SpellFeatsModel({
                    child: { effects: [new ShadowWordPainEffectModel()] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
