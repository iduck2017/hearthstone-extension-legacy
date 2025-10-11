import { ClassType, CostModel, LibraryUtil, SpellCardModel, RarityType, SchoolType, SpellFeatsModel } from "hearthstone-core";
import { HolyNovaEffectModel } from "./effect";

@LibraryUtil.is('holy-nova')
export class HolyNovaModel extends SpellCardModel {
    constructor(props?: HolyNovaModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Holy Nova',
                desc: 'Deal 2 damage to all enemy minions. Restore 2 Health to all friendly characters.',
                isCollectible: true,
                flavorDesc: 'If the Holy Light forsakes you, good luck casting this spell. Also, you\'re probably a jerk.',
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new SpellFeatsModel({
                    child: { effects: [new HolyNovaEffectModel()] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
