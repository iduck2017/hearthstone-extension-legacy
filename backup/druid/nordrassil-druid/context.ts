import { CostDecor, CostModel, FeatureModel, ManaModel, OperatorType, SpellCardModel, TurnModel } from "hearthstone-core";
import { Event, EventUtil, Model, StateUtil, TemplUtil } from "set-piece";

@TemplUtil.is('nordrassil-druid-context')
export class NordrassilDruidContextModel extends FeatureModel {
    public get status() { return true; }

    constructor(props?: NordrassilDruidContextModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Nordrassil Druid's feature",
                desc: "The next spell you cast this turn costs (3) less.",
                isActive: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @StateUtil.on(self => self.modifyCost)
    private listenCost() {
        return this.route.player?.proxy.child.hand.any(SpellCardModel).child.cost.decor
    }
    private modifyCost(that: CostModel, decor: CostDecor) {
        if (!this.state.isActive) return;
        const player = this.route.player;
        if (!player) return;
        const card = that.route.card;
        if (!(card instanceof SpellCardModel)) return;
        decor.add({
            offset: -3,
            type: OperatorType.ADD,
            method: this,
        });
    }

    @EventUtil.on(self => self.handleCast)
    private listenCast() {
        return this.route.player?.proxy.child.mana.event?.onConsume
    }
    private handleCast(that: ManaModel, event: Event<{ reason?: Model, value: number }>) {
        const player = this.route.player;
        if (!player) return;
        const reason = event.detail.reason;
        if (!(reason instanceof SpellCardModel)) return;
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

