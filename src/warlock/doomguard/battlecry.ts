import { BattlecryModel, CardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('doomguard-battlecry')
export class DoomguardBattlecryModel extends BattlecryModel<never> {
    constructor(props?: DoomguardBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Doomguard's Battlecry",
                desc: "Discard two random cards.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck() {
        return undefined;
    }

    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const minion = this.route.minion;
        if (!minion) return;

        // Discard two random cards from hand
        const hand = player.child.hand;
        const cards = hand.child.cards.filter(c => c !== minion); // Exclude this minion if it's in hand
        const cardsToDiscard: CardModel[] = [];
        
        // Select two random cards to discard
        for (let i = 0; i < 2 && cards.length > 0; i++) {
            const index = Math.floor(Math.random() * cards.length);
            const cardToDiscard = cards[index];
            if (cardToDiscard) {
                cardsToDiscard.push(cardToDiscard);
                cards.splice(index, 1);
            }
        }
        
        // TODO: Implement discard mechanic
        // for (const card of cardsToDiscard) {
        //     hand.drop(card); // Need to verify the correct method
        // }
    }
}

