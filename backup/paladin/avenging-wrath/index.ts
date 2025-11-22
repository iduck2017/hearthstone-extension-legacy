import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { AvengingWrathEffectModel } from "./effect";

@LibraryUtil.is('avenging-wrath')
export class AvengingWrathModel extends SpellCardModel {
    constructor(props?: AvengingWrathModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Avenging Wrath",
                desc: "Deal {{spellDamage[0]}} damage randomly split among all enemies.",
                flavorDesc: "Wham! Wham! Wham! Wham! Wham! Wham! Wham! Wham!",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 6 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new AvengingWrathEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

