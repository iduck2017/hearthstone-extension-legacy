import { FeatureModel, MINION_ROUTE, MinionRoute, RoleRoute, SpellCardModel } from "hearthstone-core";
import { Event, EventUtil, Loader, StoreUtil } from "set-piece";
import { FireballModel } from "../fireball";

export namespace ArchmageAntonidasFeatureProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = MinionRoute
}

@StoreUtil.is('archmage-antonidas-feature')
export class ArchmageAntonidasFeatureModel extends FeatureModel<
    ArchmageAntonidasFeatureProps.E,
    ArchmageAntonidasFeatureProps.S,
    ArchmageAntonidasFeatureProps.C,
    ArchmageAntonidasFeatureProps.R,
    ArchmageAntonidasFeatureProps.P
> {
    constructor(loader?: Loader<ArchmageAntonidasFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Archmage Antonidas's feature",
                    desc: "Whenever you cast a spell, add a 'Fireball' spell to your hand.",
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: MINION_ROUTE,
            }
        });
    }

    @EventUtil.on(self => self.route.player?.proxy.all(SpellCardModel).event.onPlay)
    private onPlay(that: SpellCardModel, event: Event) {
        const player = this.route.player;
        if (!player) return;
        // Add a Fireball spell to the player's hand
        const fireball = new FireballModel();
        const hand = player.child.hand;
        hand.add(fireball);
    }
}
