import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { RighteousnessEffectModel } from "./effect";

@LibraryUtil.is('righteousness')
export class RighteousnessModel extends SpellCardModel {
    constructor(props?: RighteousnessModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Righteousness",
                desc: "Give your minions Divine Shield.",
                flavorDesc: "Shield yourself in righteousness! It feels like a warm fuzzy blanket.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new RighteousnessEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

