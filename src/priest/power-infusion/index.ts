import { ClassType, CostModel, LibraryService, SpellCardModel, RarityType, SchoolType,  } from "hearthstone-core";
import { PowerInfusionEffectModel } from "./effect";

@LibraryService.is('power-infusion')
export class PowerInfusionModel extends SpellCardModel {
    constructor(props?: PowerInfusionModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Power Infusion',
                desc: 'Give a minion +2/+6.',
                isCollectible: true,
                flavorDesc: 'It infuses, it enthuses, it amuses!',
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                effects: props.child?.effects ?? [new PowerInfusionEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
