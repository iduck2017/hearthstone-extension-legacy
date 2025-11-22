import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { RedemptionEffectModel } from "./effect";

@LibraryUtil.is('redemption')
export class RedemptionModel extends SpellCardModel {
    constructor(props?: RedemptionModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Redemption",
                desc: "Secret: When a friendly minion dies, return it to life with 1 Health.",
                flavorDesc: "I am not sure how you get demptioned the first time. It's a mystery!",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new RedemptionEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

