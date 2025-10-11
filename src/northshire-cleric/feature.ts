import { FeatureModel, RestoreEvent, RoleHealthModel, RoleModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('northshire-cleric-feature')
export class NorthshireClericFeatureModel extends FeatureModel {
    constructor(props?: NorthshireClericFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Northshire Cleric\'s feature',
                desc: 'Whenever a minion is healed, draw a card.',
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleHeal)
    private listenHeal() {
        return this.route.game?.proxy.any(RoleHealthModel).event?.onHeal
    }
    private handleHeal(that: RoleHealthModel, event: RestoreEvent) {
        if (!this.route.board) return;
        const player = this.route.player;
        if (!player) return;
        // Only trigger for minions (not heroes)
        const minion = that.route.minion;
        if (!minion) return;
        // Draw a card
        const deck = player.child.deck;
        deck.draw();
    }
}
