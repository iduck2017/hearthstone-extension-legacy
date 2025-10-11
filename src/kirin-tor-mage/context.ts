import { CostDecor, CostModel, FeatureModel, ManaModel, SecretCardModel, TurnModel } from "hearthstone-core";
import { Event, EventUtil, Model, StateUtil, TemplUtil } from "set-piece";

@TemplUtil.is('kirin-tor-mage-feature')
export class KirinTorMageContextModel extends FeatureModel {
    constructor(props?: KirinTorMageContextModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Kirin Tor Mage's feature",
                desc: "The next Secret you play this turn costs (0).",
                isActive: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @StateUtil.on(self => self.modifyCost)
    private listenCost() {
        return this.route.player?.proxy.child.hand.child.spells.child.cost.decor
    }
    private modifyCost(that: CostModel, decor: CostDecor) {
        if (!this.state.isActive) return;
        const player = this.route.player;
        if (!player) return;
        const card = that.route.card;
        if (!(card instanceof SecretCardModel)) return;
        decor.free();
    }

    @EventUtil.on(self => self.handleCast)
    private listenCast() {
        return this.route.player?.proxy.child.mana.event?.onUse
    }
    private handleCast(that: ManaModel, event: Event<{ reason?: Model, value: number }>) {
        const player = this.route.player;
        if (!player) return;
        const reason = event.detail.reason;
        if (!(reason instanceof SecretCardModel)) return;
        player.del(this);
    }

    @EventUtil.on(self => self.handleTurn)
    private listenTurn() {
        return this.route.game?.proxy.child.turn.event?.doEnd
    }
    private handleTurn(that: TurnModel, event: Event) {
        const player = this.route.player;
        if (!player) return;
        player.del(this);
    }

}
