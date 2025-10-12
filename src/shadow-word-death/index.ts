/**
 * Shadow Word: Death
 * 
 * "If you miss, it leaves a lightning-bolt-shaped scar on your target."
 * 
 * Destroy a minion with 5 or more Attack.
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
import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel, SchoolType, SpellFeaturesModel } from "hearthstone-core";
import { ShadowWordDeathEffectModel } from "./effect";

@LibraryUtil.is('shadow-word-death')
export class ShadowWordDeathModel extends SpellCardModel {
    constructor(props?: ShadowWordDeathModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Shadow Word: Death',
                desc: 'Destroy a minion with 5 or more Attack.',
                flavorDesc: '"If you miss, it leaves a lightning-bolt-shaped scar on your target."',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new ShadowWordDeathEffectModel()] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
