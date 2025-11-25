import { Selector, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('guldans-gift-effect')
export class GuldansGiftEffectModel extends SpellEffectModel<never> {
    constructor(props?: GuldansGiftEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Gul'dan's Gift's effect",
                desc: "Discover a Temporary Mortal Coil, Siphon Soul, or Twisting Nether.",
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

        // TODO: Implement Discover mechanic
        // Need to create temporary versions of Mortal Coil, Siphon Soul, and Twisting Nether
        // Present them to the player for selection
        // Add the selected card to the player's hand
    }
}

