import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { DivineFavorEffectModel } from "./effect";

@LibraryUtil.is('divine-favor')
export class DivineFavorModel extends SpellCardModel {
    constructor(props?: DivineFavorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Divine Favor",
                desc: "Draw cards until you have as many in hand as your opponent.",
                flavorDesc: "This is not just a favor, but a divine one, like helping someone move a couch with a fold out bed!",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new DivineFavorEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

