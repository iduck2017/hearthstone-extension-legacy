import { SpellCardModel, RarityType, ClassType, SchoolType, CostModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
import { HolyFireEffectModel } from "./effect";

@ChunkService.is('holy-fire')
export class HolyFireModel extends SpellCardModel {
    constructor(props?: HolyFireModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Holy Fire",
                desc: "Deal 5 damage. Restore 5 Health to your hero.",
                flavorDesc: "Often followed by Holy Smokes!",
                rarity: RarityType.RARE,
                class: ClassType.PRIEST,
                schools: [SchoolType.HOLY],
                isCollectible: true,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 6 }}),
                effects: props.child?.effects ?? [new HolyFireEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
