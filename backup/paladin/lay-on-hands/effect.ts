import { SpellEffectModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('lay-on-hands-effect')
export class LayOnHandsEffectModel extends SpellEffectModel<[]> {
    constructor(props?: LayOnHandsEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Lay on Hands's effect",
                desc: "Restore 8 Health. Draw 3 cards.",
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
        const card = this.route.card;
        if (!card) return;
        const hero = player.child.hero;
        
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero,
                origin: 8,
            })
        ]);
        
        const deck = player.child.deck;
        deck.draw();
        deck.draw();
        deck.draw();
    }
}

