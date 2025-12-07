import { ClassType, CostModel, LibraryService, SpellCardModel, RarityType, SchoolType,  } from "hearthstone-core";
import { MassDispelEffectModel } from "./effect";

@LibraryService.is('mass-dispel')
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
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                effects: props.child?.effects ?? [new MassDispelEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
