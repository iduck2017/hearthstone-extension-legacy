/**
 * Mirror Image
 * 
 * Oh hey it's Mirror Image! !egamI rorriM s'ti yeh hO
 * 
 * Summon two 0/2 minions with Taunt.
 * 
 * Type: Spell
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: Jim Nelson
 * Collectible
 */
import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { MirrorImageEffectModel } from "./effect";

@LibraryService.is('mirror-image')
export class MirrorImageModel extends SpellCardModel {
    constructor(props?: MirrorImageModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Mirror Image",
                desc: "Summon two 0/2 minions with Taunt.",
                flavorDesc: "Oh hey it's Mirror Image! !egamI rorriM s'ti yeh hO",
                collectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.MAGE,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new MirrorImageEffectModel()],
                ...props.child 
            }
        });
    }
} 