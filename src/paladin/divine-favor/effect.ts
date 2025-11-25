import { Selector, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('divine-favor-effect')
export class DivineFavorEffectModel extends SpellEffectModel<never> {
    constructor(props?: DivineFavorEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Divine Favor's effect",
                desc: "Draw cards until you have as many in hand as your opponent.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    public async doRun(params: Array<never | undefined>) {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        
        const maximum = opponent.child.hand.child.cards.length;
        const hand = player.child.hand;
        const deck = player.child.deck;
        
        // Draw cards until hand size matches opponent's hand size or deck is empty
        while (hand.child.cards.length < maximum && deck.child.cards.length > 0) {
            await hand.draw();
        }
    }
}

