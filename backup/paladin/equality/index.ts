import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { EqualityEffectModel } from "./effect";

@LibraryService.is('equality')
export class EqualityModel extends SpellCardModel {
    constructor(props?: EqualityModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Equality",
                desc: "Change the Health of ALL minions to 1.",
                flavorDesc: "We are all special unique snowflakes... with 1 Health.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new EqualityEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

