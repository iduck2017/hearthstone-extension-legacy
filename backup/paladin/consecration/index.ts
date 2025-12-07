import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { ConsecrationEffectModel } from "./effect";

@LibraryService.is('consecration')
export class ConsecrationModel extends SpellCardModel {
    constructor(props?: ConsecrationModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Consecration",
                desc: "Deal {{spellDamage[0]}} damage to all enemies.",
                flavorDesc: "Consecrated ground glows with Holy energy. But it smells a little, too.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new ConsecrationEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

