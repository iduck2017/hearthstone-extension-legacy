import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel,  } from "hearthstone-core";
import { UthersGiftEffectModel } from "./effect";

@LibraryUtil.is('uthers-gift')
export class UthersGiftModel extends SpellCardModel {
    constructor(props?: UthersGiftModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Uther's Gift",
                desc: "Discover a Temporary Equality, Consecration, or Blessing of Kings.",
                flavorDesc: "\"I hope you enjoy light reading!\" -Uther",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PALADIN,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new UthersGiftEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

