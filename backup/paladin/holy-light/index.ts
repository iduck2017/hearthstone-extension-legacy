import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { HolyLightEffectModel } from "./effect";

@LibraryService.is('holy-light')
export class HolyLightModel extends SpellCardModel {
    constructor(props?: HolyLightModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Holy Light",
                desc: "Restore 8 Health to your hero.",
                flavorDesc: "If you are often bathed in Holy Light, you should consider wearing sunscreen.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new HolyLightEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

