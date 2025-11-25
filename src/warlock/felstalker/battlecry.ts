import { BattlecryModel, CardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('felstalker-battlecry')
export class FelstalkerBattlecryModel extends BattlecryModel<never> {
    constructor(props?: FelstalkerBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Felstalker's Battlecry",
                desc: "Discard a random card.",
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

        // Discard a random card from hand
        const hand = player.child.hand;
        const cards = hand.child.cards.filter(c => c !== minion); // Exclude this minion if it's in hand
        if (cards.length > 0) {
            const index = Math.floor(Math.random() * cards.length);
            const cardToDiscard = cards[index];
            if (cardToDiscard) {
                // TODO: Implement discard mechanic
                // hand.drop(cardToDiscard); // Need to verify the correct method
            }
        }
    }
}

