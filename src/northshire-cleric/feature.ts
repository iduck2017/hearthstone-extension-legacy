import { FeatureModel, RestoreEvent, RoleHealthModel, RoleModel } from "hearthstone-core";
import { Event, EventUtil, Loader, StoreUtil } from "set-piece";

@StoreUtil.is('northshire-cleric-feature')
export class NorthshireClericFeatureModel extends FeatureModel {
    constructor(loader?: Loader<NorthshireClericFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Northshire Cleric\'s feature',
                    desc: 'Whenever a minion is healed, draw a card.',
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            };
        });
    }

    @EventUtil.on(self => self.route.game?.proxy.all(RoleHealthModel).event.onHeal)
    private onHeal(that: RoleHealthModel, event: RestoreEvent) {
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
