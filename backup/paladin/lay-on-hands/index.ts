import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { LayOnHandsEffectModel } from "./effect";

@LibraryUtil.is('lay-on-hands')
export class LayOnHandsModel extends SpellCardModel {
    constructor(props?: LayOnHandsModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Lay on Hands",
                desc: "Restore 8 Health. Draw 3 cards.",
                flavorDesc: "A grammatically awkward life saver.",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 6 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new LayOnHandsEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

