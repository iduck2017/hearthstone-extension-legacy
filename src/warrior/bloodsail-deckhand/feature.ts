import { RoleFeatureModel, WeaponCardModel, CostModel, CostDecor, CostType, OperatorType, WeaponPerformModel, FeatureModel } from "hearthstone-core";
import { StateUtil, Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('bloodsail-deckhand-feature')
export class BloodsailDeckhandFeatureModel extends FeatureModel {
    constructor(props?: BloodsailDeckhandFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Bloodsail Deckhand's Feature",
                desc: "The next weapon you play costs (1) less.",
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handlePlay)
    protected listenPlay() {
        const player = this.route.player;
        if (!player) return;
        const weapon = player.proxy.any(WeaponCardModel);
        if (!weapon) return;
        return weapon.child.perform.event?.onPlay
    }
    protected handlePlay(that: WeaponPerformModel, event: Event) {
        this.disable();
    }

    @StateUtil.on(self => self.modifyCost)
    protected listenCost() {
        const player = this.route.player;
        if (!player) return;
        const weapon = player.proxy.child.hand.any(WeaponCardModel);
        if (!weapon) return;
        return weapon.child.cost.decor;
    }
    protected modifyCost(that: CostModel, decor: CostDecor) {
        if (!this.state.isActived) return;
        

        const card = that.route.card;
        if (!(card instanceof WeaponCardModel)) return;
        
        const player = this.route.player;
        if (!player) return;
        if (card.route.player !== player) return;
        
        if (that.state.type !== CostType.MANA) return;
        
        // Reduce the cost by 1
        decor.add({
            offset: -1,
            type: OperatorType.ADD,
            method: this,
        });
    }
}

