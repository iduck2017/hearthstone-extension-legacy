/**
 * Mind Blast
 * 
 * "This spell blasts you directly in the MIND."
 * 
 * Deal 5 damage to the enemy hero.
 * 
 * Type: Spell
 * Spell School: Shadow
 * Rarity: Common
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Dave Allsop
 * Collectible
 * 
 * 2 cost
 */
import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel, SchoolType, SpellFeatsModel } from "hearthstone-core";
import { MindBlastEffectModel } from "./effect";

@LibraryUtil.is('mind-blast')
export class MindBlastModel extends SpellCardModel {
    constructor(props?: MindBlastModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Mind Blast',
                desc: 'Deal 5 damage to the enemy hero.',
                flavorDesc: '"This spell blasts you directly in the MIND."',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new SpellFeatsModel({
                    child: { effects: [new MindBlastEffectModel()] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
