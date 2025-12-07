import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { RepentanceEffectModel } from "./effect";

@LibraryService.is('repentance')
export class RepentanceModel extends SpellCardModel {
    constructor(props?: RepentanceModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Repentance",
                desc: "Secret: After your opponent plays a minion, reduce its Health to 1.",
                flavorDesc: "Repentance often comes in the moment before obliteration. Curious.",
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
                    child: { effects: [new RepentanceEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

