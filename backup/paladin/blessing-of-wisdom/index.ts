import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel,  } from "hearthstone-core";
import { BlessingOfWisdomEffectModel } from "./effect";

@LibraryUtil.is('blessing-of-wisdom')
export class BlessingOfWisdomModel extends SpellCardModel {
    constructor(props?: BlessingOfWisdomModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blessing of Wisdom",
                desc: "Choose a minion. Whenever it attacks, draw a card.",
                flavorDesc: "Apparently with wisdom comes the knowledge that you should probably be attacking every turn.",
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
                    child: { effects: [new BlessingOfWisdomEffectModel()] }
                }),
                ...props.child
            }
        });
    }
}

