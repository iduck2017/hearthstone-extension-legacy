import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SecretCardModel, SpellCardModel, SpellFeatsModel } from "hearthstone-core";
import { CounterspellFeatureModel } from "./feature";

@LibraryUtil.is('counterspell')
export class CounterspellModel extends SecretCardModel {
    constructor(props?: CounterspellModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Counterspell",
                desc: "Secret: When your opponent casts a spell, Counter it.",
                flavorDesc: "What's the difference between a mage playing with Counterspell and a mage who isn't? The mage who isn't is getting Pyroblasted in the face.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.MAGE,
                schools: [SchoolType.ARCANE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                feats: new SpellFeatsModel({
                    child: {
                        list: [new CounterspellFeatureModel()]
                    }
                }),
                ...props.child 
            }
        });
    }
}