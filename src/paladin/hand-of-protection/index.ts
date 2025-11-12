import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { HandOfProtectionEffectModel } from "./effect";

@LibraryUtil.is('hand-of-protection')
export class HandOfProtectionModel extends SpellCardModel {
    constructor(props?: HandOfProtectionModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Hand of Protection",
                desc: "Give a minion Divine Shield.",
                flavorDesc: "This spell has been renamed so many times, even paladins don't know what it should be called anymore.",
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
                    child: { effects: [new HandOfProtectionEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

