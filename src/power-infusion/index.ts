import { Loader } from "set-piece";
import { ClassType, CostModel, LibraryUtil, SpellCardModel, RarityType, SchoolType } from "hearthstone-core";
import { PowerInfusionEffectModel } from "./effect";

@LibraryUtil.is('power-infusion')
export class PowerInfusionModel extends SpellCardModel {
    constructor(loader?: Loader<PowerInfusionModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
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
                    cost: new CostModel(() => ({ state: { origin: 4 }})),
                    effects: [new PowerInfusionEffectModel()],
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
