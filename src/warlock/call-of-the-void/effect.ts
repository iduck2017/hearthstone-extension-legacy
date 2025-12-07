import { Selector, SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('call-of-the-void-effect')
export class CallOfTheVoidEffectModel extends SpellEffectModel<never> {
    constructor(props?: CallOfTheVoidEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Call of the Void's effect",
                desc: "Add a random Demon to your hand.",
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

        // TODO: Implement random Demon generation
        // Need to get a random Demon card from the game's card library
        // const hand = player.child.hand;
        // const randomDemon = getRandomDemonCard();
        // hand.gain(randomDemon);
    }
}

