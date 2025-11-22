import { CardModel, BattlecryModel, Selector } from "hearthstone-core";
import { TemplUtil, TranxUtil } from "set-piece";

@TemplUtil.is('psychic-conjurer-battlecry')
export class PsychicConjurerBattlecryModel extends BattlecryModel<never> {
    constructor(props?: PsychicConjurerBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Psychic Conjurer\'s Battlecry',
                desc: 'Copy a card in your opponent\'s deck and add it to your hand.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        
        const deck = opponent.child.deck;
        const cards = deck.child.cards;
        
        // If opponent has no cards in deck, do nothing
        if (cards.length === 0) return;
        
        // Select a random card from opponent's deck
        const index = Math.floor(Math.random() * cards.length);
        const card = cards[index];
        if (!card) return;
        
        // Create a copy of the random card
        const hand = player.child.hand;
        const copy = card.clone();
        if (!copy) return;
        hand.gain(copy);
    }

}
