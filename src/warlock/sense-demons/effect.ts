import { Selector, SpellEffectModel, MinionCardModel, RaceType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('sense-demons-effect')
export class SenseDemonsEffectModel extends SpellEffectModel<never> {
    constructor(props?: SenseDemonsEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Sense Demons's effect",
                desc: "Draw 2 Demons from your deck.",
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
        const hand = player.child.hand;
        const deck = player.child.deck;

        // Find Demons in deck
        const demons = deck.child.cards.filter(card => 
            card instanceof MinionCardModel && card.state.races.includes(RaceType.DEMON)
        );

        // Draw up to 2 Demons
        for (let i = 0; i < 2 && demons.length > 0; i++) {
            const index = Math.floor(Math.random() * demons.length);
            const demon = demons[index];
            if (demon) {
                // TODO: Implement drawing specific cards from deck
                // deck.remove(demon);
                // hand.gain(demon);
                demons.splice(index, 1);
            }
        }
    }
}

