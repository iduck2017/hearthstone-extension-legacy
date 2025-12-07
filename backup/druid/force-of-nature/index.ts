/**
 * Force of Nature
 * 
 * "I think I'll just nap under these trees. Wait... AAAAAHHH!" - Blinkfizz, the Unfortunate Gnome
 * 
 * Summon three 2/2 Treants.
 * 
 * Type: Spell
 * Spell School: Nature
 * Rarity: Epic
 * Set: Legacy
 * Class: Druid
 * Artist: Trevor Jacobs
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { ForceOfNatureEffectModel } from "./effect";

@LibraryService.is('force-of-nature')
export class ForceOfNatureModel extends SpellCardModel {
    constructor(props?: ForceOfNatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Force of Nature",
                desc: "Summon three 2/2 Treants.",
                flavorDesc: "\"I think I'll just nap under these trees. Wait... AAAAAHHH!\" - Blinkfizz, the Unfortunate Gnome",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.DRUID,
                schools: [SchoolType.NATURE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new ForceOfNatureEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

