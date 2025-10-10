/**
 * Power Word: Shield
 * 
 * Sure the extra protection is nice, but the shield really reduces visibility.
 * 
 * Give a minion +2 Health. Draw a card.
 * 
 * Type: Spell
 * Spell School: Holy
 * Rarity: Free
 * Set: Legacy
 * Class: Priest
 * Artist: Jessica Jung
 * Collectible
 */
import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeatsModel } from "hearthstone-core";
import { PowerWordShieldEffectModel } from "./effect";

@LibraryUtil.is('power-word-shield')
export class PowerWordShieldModel extends SpellCardModel {
    constructor(props?: PowerWordShieldModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Power Word: Shield",
                desc: "Give a minion +2 Health. Draw a card.",
                flavorDesc: "Sure the extra protection is nice, but the shield really reduces visibility.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new SpellFeatsModel({
                    child: { effects: [new PowerWordShieldEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}