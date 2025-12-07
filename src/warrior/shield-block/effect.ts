import { Selector, SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('shield-block-effect')
export class ShieldBlockEffectModel extends SpellEffectModel<never> {
    constructor(props?: ShieldBlockEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shield Block's effect",
                desc: "Gain 5 Armor. Draw a card.",
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
        const hero = player.child.hero;
        
        // Gain 5 Armor
        hero.child.armor.gain(5);
        
        // Draw a card
        const hand = player.child.hand;
        hand.draw();
    }
}

