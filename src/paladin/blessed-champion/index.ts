import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { BlessedChampionEffectModel } from "./effect";

@LibraryUtil.is('blessed-champion')
export class BlessedChampionModel extends SpellCardModel {
    constructor(props?: BlessedChampionModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blessed Champion",
                desc: "Double a minion's Attack.",
                flavorDesc: "This card causes double the trouble AND double the fun.",
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
                    child: { effects: [new BlessedChampionEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

