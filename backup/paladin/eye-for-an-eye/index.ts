import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { EyeForAnEyeEffectModel } from "./effect";

@LibraryUtil.is('eye-for-an-eye')
export class EyeForAnEyeModel extends SpellCardModel {
    constructor(props?: EyeForAnEyeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Eye for an Eye",
                desc: "Secret: When your hero takes damage, deal that much damage to the enemy hero.",
                flavorDesc: "Justice sometimes takes the form of a closed fist into a soft cheek.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new EyeForAnEyeEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

