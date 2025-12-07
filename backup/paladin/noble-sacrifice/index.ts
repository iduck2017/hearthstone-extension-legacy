import { ClassType, CostModel, LibraryService, RarityType, SpellCardModel,  } from "hearthstone-core";
import { NobleSacrificeEffectModel } from "./effect";

@LibraryService.is('noble-sacrifice')
export class NobleSacrificeModel extends SpellCardModel {
    constructor(props?: NobleSacrificeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Noble Sacrifice",
                desc: "Secret: When an enemy attacks, summon a 2/1 Defender as the new target.",
                flavorDesc: "We will always remember you, \"Defender!\"",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new NobleSacrificeEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

