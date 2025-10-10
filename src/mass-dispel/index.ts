import { ClassType, CostModel, LibraryUtil, SpellCardModel, RarityType, SchoolType, SpellFeatsModel } from "hearthstone-core";
import { MassDispelEffectModel } from "./effect";

@LibraryUtil.is('mass-dispel')
export class MassDispelModel extends SpellCardModel {
    constructor(props?: MassDispelModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Mass Dispel',
                desc: 'Silence all enemy minions. Draw a card.',
                isCollectible: true,
                flavorDesc: 'It dispels buffs, powers, hopes, and dreams.',
                rarity: RarityType.RARE,
                class: ClassType.PRIEST,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 4 }}),
                feats: props.child?.feats ?? new SpellFeatsModel({
                    child: { effects: [new MassDispelEffectModel()] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
