/**
 * Savage Roar
 * 
 * What do they roar? Nobody can quite tell, but it sounds like "Elephant Macho Breeze". It's probably not that, though.
 * 
 * Give your characters +2 Attack this turn.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Grace Liu
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { SavageRoarEffectModel } from "./effect";

@LibraryUtil.is('savage-roar')
export class SavageRoarModel extends SpellCardModel {
    constructor(props?: SavageRoarModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Savage Roar",
                desc: "Give your characters +2 Attack this turn.",
                flavorDesc: "What do they roar? Nobody can quite tell, but it sounds like \"Elephant Macho Breeze\". It's probably not that, though.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new SavageRoarEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

