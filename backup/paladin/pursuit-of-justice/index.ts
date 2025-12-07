import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { PursuitOfJusticeEffectModel } from "./effect";

@LibraryService.is('pursuit-of-justice')
export class PursuitOfJusticeModel extends SpellCardModel {
    constructor(props?: PursuitOfJusticeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Pursuit of Justice",
                desc: "Give +1 Attack to Silver Hand Recruits you summon this game.",
                flavorDesc: "\"Is this about justice or just us?\"",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            refer: { ...props.refer },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new ({
                    child: { effects: [new PursuitOfJusticeEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

