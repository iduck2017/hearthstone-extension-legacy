import { ClassType, CostModel, LibraryUtil, SpellCardModel, RarityType, SchoolType, SpellFeaturesModel } from "hearthstone-core";
import { ShadowWordRuinEffectModel } from "./effect";

@LibraryUtil.is('shadow-word-ruin')
export class ShadowWordRuinModel extends SpellCardModel {
    constructor(props?: ShadowWordRuinModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Shadow Word: Ruin',
                desc: 'Destroy all minions with 5 or more Attack.',
                isCollectible: true,
                flavorDesc: 'Discovered by a worgen priest after a giant spilled a drink on her new white robes.',
                rarity: RarityType.EPIC,
                class: ClassType.PRIEST,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new ShadowWordRuinEffectModel()] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
