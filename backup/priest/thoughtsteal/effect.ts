import { CardModel, SpellEffectModel, Selector } from "hearthstone-core";
import { TemplUtil, TranxUtil } from "set-piece";

@TemplUtil.is('thoughtsteal-effect')
export class ThoughtstealEffectModel extends SpellEffectModel<never> {
    constructor(props?: ThoughtstealEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Thoughtsteal's effect",
                desc: "Copy 2 cards in your opponent's deck and add them to your hand.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public prepare(...prev: never[]): Selector<never> | undefined {
        return undefined;
    }

    protected run() {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        
        const deck = opponent.child.deck;
        const cards = [...deck.child.cards];
        
        // If opponent has no cards in deck, do nothing
        if (cards.length === 0) return;
        
        // Copy up to 2 random cards from opponent's deck
        for (let i = 0; i < 2; i++) {
            if (!cards.length) break;
            const index = Math.floor(Math.random() * cards.length);
            const card = cards[index];
            if (!card) continue;
            // Create a copy of the random card
            const hand = player.child.hand;
            hand.add(card, undefined, { isClone: true });
            cards.splice(index, 1);
        }
    }

}
