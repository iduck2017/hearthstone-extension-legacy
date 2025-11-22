import { RoleFeatureModel, RestoreEvent, RoleHealthModel } from "hearthstone-core";
import { DebugUtil, Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('northshire-cleric-feature')
export class NorthshireClericFeatureModel extends RoleFeatureModel {
    constructor(props?: NorthshireClericFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Northshire Cleric\'s feature',
                desc: 'Whenever a minion is healed, draw a card.',
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleHeal)
    private listenHeal() {
        const game = this.route.game;
        if (!game) return;
        const health = game.proxy.any(RoleHealthModel);
        if (!health) return;
        return health.event?.onRestore
    }
    private handleHeal(that: RoleHealthModel, event: RestoreEvent) {

        const player = this.route.player;
        if (!player) return;
        // Only trigger for minions (not heroes)
        const minionB = that.route.minion;
        if (!minionB) return;
        // Draw a card
        const hand = player.child.hand;
        hand.draw();

        const minionA = this.route.card;
        if (!minionA) return;
        DebugUtil.log(`${minionA.name} Draw a card because of ${minionB?.name}`);
    }
}
