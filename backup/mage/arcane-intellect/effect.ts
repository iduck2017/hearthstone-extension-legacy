import { EffectModel, Selector, SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('arcane-intellect-effect')
export class ArcaneIntellectEffectModel extends SpellEffectModel<never> {
    constructor(props?: ArcaneIntellectEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Arcane Intellect's effect",
                desc: "Draw 2 cards.",
                damage: [],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public prepare(...prev: never[]): Selector<never> | undefined {
        return undefined
    }

    protected run(params: never[]) {
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        
        // Draw 2 cards
        deck.draw();
        deck.draw();
    }
}
