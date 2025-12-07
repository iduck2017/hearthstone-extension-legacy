/**
 * Light's Justice
 * 
 * Prince Malchezaar was a collector of rare weapons. He'd animate them and have them dance for him.
 * 
 * Type: Weapon
 * Rarity: Common
 * Set: Legacy
 * Class: Paladin
 * Artist: Glenn Rane
 * Collectible
 * 
 * 1 mana 1/4
 */

import { ClassType, CostModel, WeaponActionModel, RarityType, WeaponAttackModel, WeaponCardModel, LibraryService } from "hearthstone-core";

@LibraryService.is('lights-justice')
export class LightsJusticeModel extends WeaponCardModel {
    constructor(props?: LightsJusticeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Light's Justice",
                desc: "",
                flavorDesc: "Prince Malchezaar was a collector of rare weapons. He'd animate them and have them dance for him.",
                class: ClassType.PALADIN,
                rarity: RarityType.COMMON,
                isCollectible: true,
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                attack: new WeaponAttackModel({ state: { origin: 1 }}),
                action: new WeaponActionModel({ state: { origin: 4 }}),
                ...props.child
            },
            refer: { ...props.refer }
        })
    }
}

