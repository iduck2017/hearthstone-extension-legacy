import { BattlecryModel, CardModel, MinionModel, RaceType } from "hearthstone-core";

export class CaptainsParrotBattlecryModel extends BattlecryModel<[]> {
    constructor(props: CaptainsParrotBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Captain\'s Parrot\'s Battlecry',
                desc: 'Draw a Pirate from your deck.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [] | undefined { return []; }

    // Draw a pirate from deck
    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        
        // Find pirates in the deck
        const cards = deck.child.cards.filter(item => {
            if (!(item instanceof MinionModel)) return false;
            return item.state.races.includes(RaceType.PIRATE);
        });
        if (cards.length === 0) return;
        
        // Draw the first pirate found
        const index = Math.floor(Math.random() * cards.length);
        const card = cards[index];
        if (!card) return;
        card.draw();
    }
} 