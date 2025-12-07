/**
 * Power of the Wild
 * 
 * Never look a panther in the eye. Or is it 'Always look a panther in the eye'? Well, it's one of those.
 * 
 * Choose One - Give your minions +1/+1; or Summon a 3/2 Panther.
 * 
 * Type: Spell
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Steve Tappin
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel,  } from "hearthstone-core";
import { PowerOfTheWildEffectModel } from "./effect";

@LibraryService.is('power-of-the-wild')
export class PowerOfTheWildModel extends SpellCardModel {
    constructor(props?: PowerOfTheWildModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Power of the Wild",
                desc: "Choose One - Give your minions +1/+1; or Summon a 3/2 Panther.",
                flavorDesc: "Never look a panther in the eye. Or is it 'Always look a panther in the eye'? Well, it's one of those.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new PowerOfTheWildEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}

