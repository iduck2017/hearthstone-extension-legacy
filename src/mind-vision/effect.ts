import { CardModel, EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil, TranxUtil } from "set-piece";

@TemplUtil.is('mind-vision-effect')
export class MindVisionEffectModel extends SpellEffectModel<[]> {
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

    toRun(): [] {
        // No target selection needed
        return [];
    }

    protected async doRun() {
        const player = this.route.player;
        if (!player) return;
        
        const opponent = player.refer.opponent;
        if (!opponent) return;
        
        const handB = opponent.child.hand;
        // If opponent has no cards, do nothing
        if (handB.refer.queue?.length === 0) return;
        
        // Select a random card from opponent's hand
        const index = Math.floor(Math.random() * handB.refer.queue?.length);
        const card = handB.refer.order[index];
        if (!card) return;
        
        // Create a copy of the random card
        const hand = player.child.hand;
        hand.copy(card);
    }

}
