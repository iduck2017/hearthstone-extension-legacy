import { CostDecor, CostModel, CostType, FeatureModel, SpellCardModel } from "hearthstone-core";
import { Event, EventUtil, StateUtil, TemplUtil } from "set-piece";

@TemplUtil.is('sorcerers-apprentice-feature')
export class SorcerersApprenticeFeatureModel extends FeatureModel {
    constructor(props?: SorcerersApprenticeFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Sorcerer's Apprentice's feature",
                desc: "Your spells cost (1) less (but not less than 1).",
                isActive: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    @StateUtil.on(self => self.modifyCost)
    private listenCost() {
        return this.route.player?.proxy.child.hand.child.spells.child.cost.decor
    }
    private modifyCost(that: CostModel, decor: CostDecor) {
        if (!this.route.board) return;
        const card = that.route.card;
        const player = that.route.player;
        if (player !== this.route.player) return;
        if (that.state.type !== CostType.MANA) return;
        decor.add(-1, true);
    }
}
