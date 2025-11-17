import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel, SpellFeaturesModel } from "hearthstone-core";
import { HumilityEffectModel } from "./effect";

@LibraryUtil.is('humility')
export class HumilityModel extends SpellCardModel {
    constructor(props?: HumilityModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Humility",
                desc: "Change a minion's Attack to 1.",
                flavorDesc: "This card makes something really damp. Oh wait. That's \"Humidity.\"",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new HumilityEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

