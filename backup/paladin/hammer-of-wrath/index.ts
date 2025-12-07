import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { HammerOfWrathEffectModel } from "./effect";

@LibraryService.is('hammer-of-wrath')
export class HammerOfWrathModel extends SpellCardModel {
    constructor(props?: HammerOfWrathModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Hammer of Wrath",
                desc: "Deal {{spellDamage[0]}} damage. Draw a card.",
                flavorDesc: "A good paladin has many tools. Hammer of Wrath, Pliers of Vengeance, Hacksaw of Justice, etc.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new HammerOfWrathEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

