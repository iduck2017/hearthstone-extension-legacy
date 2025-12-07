/**
 * Wrath
 * 
 * The talk around the Ratchet Inn is that this card is too good and should be a Legendary.
 * 
 * Choose One - Deal 3 damage to a minion; or 1 damage and draw a card.
 * 
 * Type: Spell
 * Spell School: Nature
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Raymond Swanland
 * Collectible
 */
import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { WrathEffectModel } from "./effect";

@LibraryService.is('wrath')
export class WrathModel extends SpellCardModel {
    constructor(props?: WrathModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Wrath",
                desc: "Choose One - Deal 3 damage to a minion; or 1 damage and draw a card.",
                flavorDesc: "The talk around the Ratchet Inn is that this card is too good and should be a Legendary.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [SchoolType.NATURE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new WrathEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

