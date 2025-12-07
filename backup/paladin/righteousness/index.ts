import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { RighteousnessEffectModel } from "./effect";

@LibraryService.is('righteousness')
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
                feats: props.child?.feats ?? new ({
                    child: { effects: [new RighteousnessEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

