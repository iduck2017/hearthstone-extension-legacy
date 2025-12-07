import { CostDecor, CostModel, FeatureModel, ManaModel, OperatorType, SecretCardModel, SpellCardModel, TurnModel } from "hearthstone-core";
import { Event, EventPlugin, Model, StatePlugin, ChunkService } from "set-piece";

@ChunkService.is('kirin-tor-mage-feature')
export class KirinTorMageContextModel extends FeatureModel {
    public get status() { return true; }

    constructor(props?: KirinTorMageContextModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Kirin Tor Mage's feature",
                desc: "The next Secret you play this turn costs (0).",
                actived: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @StatePlugin.on(self => self.modifyCost)
    private listenCost() {
        return this.route.player?.proxy.child.hand.any(SpellCardModel).child.cost.decor
    }
    private modifyCost(that: CostModel, decor: CostDecor) {
        if (!this.state.actived) return;
        const player = this.route.player;
        if (!player) return;
        const card = that.route.card;
        if (!(card instanceof SecretCardModel)) return;
        decor.add({
            offset: 0,
            type: OperatorType.SET,
            method: this,
        });
    }

    @EventPlugin.on(self => self.handleCast)
    private listenCast() {
        return this.route.player?.proxy.child.mana.event?.onConsume
    }
    private handleCast(that: ManaModel, event: Event<{ reason?: Model, value: number }>) {
        const player = this.route.player;
        if (!player) return;
        const reason = event.detail.reason;
        if (!(reason instanceof SecretCardModel)) return;
        player.debuff(this);
    }

    @EventPlugin.on(self => self.handleTurn)
    private listenTurn() {
        return this.route.game?.proxy.child.turn.event?.onEnd
    }
    private handleTurn(that: TurnModel, event: Event) {
        const player = this.route.player;
        if (!player) return;
        player.debuff(this);
    }

}
