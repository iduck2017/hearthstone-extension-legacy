import { EffectModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('arcane-intellect-effect')
export class ArcaneIntellectEffectModel extends EffectModel<[]> {
    constructor(loader?: Loader<ArcaneIntellectEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Arcane Intellect's effect",
                    desc: "Draw 2 cards.",
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer } 
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
