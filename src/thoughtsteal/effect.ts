import { CardModel, SpellEffectModel } from "hearthstone-core";
import { Loader, StoreUtil, TranxUtil } from "set-piece";

@StoreUtil.is('thoughtsteal-effect')
export class ThoughtstealEffectModel extends SpellEffectModel<[]> {
    constructor(loader?: Loader<ThoughtstealEffectModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Thoughtsteal's effect",
                    desc: "Copy 2 cards in your opponent's deck and add them to your hand.",
                    damage: [],
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    toRun(): [] {
        // No target selection needed
        return [];
    }

    protected async doRun() {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        
        const deck = opponent.child.deck;
        const cards = [...deck.refer.order];
        
        // If opponent has no cards in deck, do nothing
        if (cards.length === 0) return;
        
        // Copy up to 2 random cards from opponent's deck
        for (let i = 0; i < 2; i++) {
            if (cards.length === 0) break;
            const index = Math.floor(Math.random() * cards.length);
            const card = cards[index];
            if (!card) continue;
            // Create a copy of the random card
            this.copy(card);
            cards.splice(index, 1);
        }
    }

    @TranxUtil.span()
    private copy(card: CardModel) {
        const player = this.route.player;
        if (!player) return;
        const copy = CardModel.copy(card);
        if (!copy) return;
        // Add the copy to player's hand
        const handA = player.child.hand;
        handA.add(copy);
    }
}
