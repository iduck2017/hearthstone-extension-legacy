/**
 * Radiance
 * 
 * "Because you're worth it!"
 * 
 * Restore 5 Health to your hero.
 * 
 * Type: Spell
 * Spell School: Holy
 * Rarity: Free
 * Set: Legacy
 * Class: Priest
 * Artist: James Ryman
 * Collectible
 * 
 * 1 cost
 */
import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel, SchoolType, SpellFeatsModel } from "hearthstone-core";
import { RadianceEffectModel } from "./effect";

@LibraryUtil.is('radiance')
export class RadianceModel extends SpellCardModel {
    constructor(props?: RadianceModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Radiance',
                desc: 'Restore 5 Health to your hero.',
                flavorDesc: '"Because you\'re worth it!"',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new SpellFeatsModel({
                    child: { effects: [new RadianceEffectModel()] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
