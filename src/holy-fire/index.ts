import { SpellCardModel, RarityType, ClassType, SchoolType, CostModel, SpellFeatsModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";
import { HolyFireEffectModel } from "./effect";

@StoreUtil.is('holy-fire')
export class HolyFireModel extends SpellCardModel {
    constructor(loader?: Loader<HolyFireModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Holy Fire",
                    desc: "Deal 5 damage. Restore 5 Health to your hero.",
                    flavorDesc: "Often followed by Holy Smokes!",
                    cost: 6,
                    rarity: RarityType.RARE,
                    class: ClassType.PRIEST,
                    schools: [SchoolType.HOLY],
                    isCollectible: true,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 6 }})),
                    feats: props.child?.feats ?? new SpellFeatsModel(() => ({
                        child: { effects: [new HolyFireEffectModel()] }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
