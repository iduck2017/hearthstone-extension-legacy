import { CARD_ROUTE, CardRoute, FeatureModel, MINION_ROUTE, MinionRoute, ROLE_ROUTE, RoleRoute, SpellCardModel, SpellPerformModel } from "hearthstone-core";
import { Event, EventUtil, Loader, StoreUtil } from "set-piece";
import { ManaWyrmBuffModel } from "./buff";

export namespace ManaWyrmFeatureProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = MinionRoute
}

@StoreUtil.is('mana-wyrm-feature')
export class ManaWyrmFeatureModel extends FeatureModel<
    ManaWyrmFeatureProps.E,
    ManaWyrmFeatureProps.S,
    ManaWyrmFeatureProps.C,
    ManaWyrmFeatureProps.R,
    ManaWyrmFeatureProps.P
> {
    constructor(loader?: Loader<ManaWyrmFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Mana Wyrm's feature",
                    desc: "Whenever you cast a spell, gain +1 Attack.",
                    isActive: true,
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: MINION_ROUTE,
            }
        })
    }

    @EventUtil.on(self => self.route.player?.proxy.all(SpellCardModel).event.onPlay)
    private onPlay(that: SpellCardModel, event: Event) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        
        // Only trigger when the minion's owner casts a spell
        if (that.route.player !== player) return;
        
        minion.child.role.add(new ManaWyrmBuffModel())
    }
}
