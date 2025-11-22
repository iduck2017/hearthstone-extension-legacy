import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { HolyWrathEffectModel } from "./effect";

@LibraryUtil.is('holy-wrath')
export class HolyWrathModel extends SpellCardModel {
    constructor(props?: HolyWrathModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Holy Wrath",
                desc: "Draw a card and deal damage equal to its Cost.",
                flavorDesc: "C'mon Molten Giant!!",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new HolyWrathEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

