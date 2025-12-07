import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { ReckoningEffectModel } from "./effect";

@LibraryService.is('reckoning')
export class ReckoningModel extends SpellCardModel {
    constructor(props?: ReckoningModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Reckoning",
                desc: "Secret: After an enemy minion deals 3 or more damage, destroy it.",
                flavorDesc: "He would henceforth be known as \"Karmerr, the Doom of Kazzak.\"",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new ReckoningEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

