import { CardModel, EffectModel, SpellEffectModel, Selector } from "hearthstone-core";
import { TemplUtil, TranxUtil } from "set-piece";

@TemplUtil.is('mind-vision-effect')
export class MindVisionEffectModel extends SpellEffectModel<never> {
    constructor(props?: MindVisionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mind Vision's effect",
                desc: "Put a copy of a random card in your opponent's hand into your hand.",
                damage: [],
                ...props.state
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
        
        const handB = opponent.child.hand;
        // If opponent has no cards, do nothing
        if (handB.child.cards.length === 0) return;
        
        // Select a random card from opponent's hand
        const index = Math.floor(Math.random() * handB.child.cards.length);
        const card = handB.child.cards[index];
        if (!card) return;
        
        // Create a copy of the random card
        const hand = player.child.hand;
        hand.add(card, undefined, { isClone: true });
    }

}
