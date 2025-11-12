import { SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('divine-favor-effect')
export class DivineFavorEffectModel extends SpellEffectModel<[]> {
    constructor(props?: DivineFavorEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Divine Favor's effect",
                desc: "Draw cards until you have as many in hand as your opponent.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        
        const opponentHandSize = opponent.child.hand.child.cards.length;
        const deck = player.child.deck;
        
        while (player.child.hand.child.cards.length < opponentHandSize && deck.child.cards.length > 0) {
            deck.draw();
        }
    }
}

