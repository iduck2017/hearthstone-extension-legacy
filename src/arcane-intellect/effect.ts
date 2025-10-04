import { CARD_ROUTE, CardRoute, EffectModel, SpellEffectModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

export namespace ArcaneIntellectEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@StoreUtil.is('arcane-intellect-effect')
export class ArcaneIntellectEffectModel extends SpellEffectModel<[],
  ArcaneIntellectEffectProps.E,
  ArcaneIntellectEffectProps.S,
  ArcaneIntellectEffectProps.C,
  ArcaneIntellectEffectProps.R
> {
    constructor(loader?: Loader<ArcaneIntellectEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Arcane Intellect's effect",
                    desc: "Draw 2 cards.",
                    damage: [],
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: CARD_ROUTE
            }
        })
    }

    toRun(): [] { return [] }

    protected async doRun() {
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        
        // Draw 2 cards
        deck.draw();
        deck.draw();
    }
}
