import { CardFeatureModel, CostDecor, CostModel, CostType, SpellCardModel } from "hearthstone-core";
import { Event, EventUtil, Loader, StateUtil, StoreUtil } from "set-piece";

@StoreUtil.is('sorcerers-apprentice-feature')
export class SorcerersApprenticeFeatureModel extends CardFeatureModel {
    constructor(loader?: Loader<SorcerersApprenticeFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Sorcerer's Apprentice's feature",
                    desc: "Your spells cost (1) less (but not less than 1).",
                    isActive: true,
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        })
    }

    @StateUtil.on(self => self.route.player?.proxy.child.hand.child.spells.child.cost.decor)
    private onCompute(that: CostModel, decor: CostDecor) {
        if (!this.route.board) return;
        const card = that.route.card;
        const player = that.route.player;
        if (!(card instanceof SpellCardModel)) return;
        if (player !== this.route.player) return;
        if (that.state.type !== CostType.MANA) return;
        decor.add(-1, true);
    }
}
