import { Loader } from "set-piece";
import { ClassType, CostModel, LibraryUtil, SpellCardModel, RarityType, SchoolType } from "hearthstone-core";
import { MassDispelEffectModel } from "./effect";

@LibraryUtil.is('mass-dispel')
export class MassDispelModel extends SpellCardModel {
    constructor(loader?: Loader<MassDispelModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
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
                    cost: new CostModel(() => ({ state: { origin: 4 }})),
                    effects: [new MassDispelEffectModel()],
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
