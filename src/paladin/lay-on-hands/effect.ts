import { Selector, SpellEffectModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('lay-on-hands-effect')
export class LayOnHandsEffectModel extends SpellEffectModel<never> {
    constructor(props?: LayOnHandsEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Lay on Hands's effect",
                desc: "Restore 8 Health. Draw 3 cards.",
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
        const card = this.route.card;
        if (!card) return;
        const hero = player.child.hero;
        const hand = player.child.hand;
        
        // Restore 8 Health to your hero
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero,
                origin: 8,
            })
        ]);
        
        // Draw 3 cards
        for (let index = 0; index < 3; index++) {
            await hand.draw();
        }
    }
}

