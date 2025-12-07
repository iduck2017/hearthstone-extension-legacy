import { Selector, SpellEffectModel, MinionCardModel, PlayerModel } from "hearthstone-core";
import { DebugUtil, TemplUtil } from "set-piece";
import { CommandingShoutContextModel } from "./context";

@TemplUtil.is('commanding-shout-effect')
export class CommandingShoutEffectModel extends SpellEffectModel<never> {
    constructor(props?: CommandingShoutEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Commanding Shout's effect",
                desc: "Your minions can't be reduced below 1 Health this turn. Draw a card.",
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
        
        player.buff(new CommandingShoutContextModel());
        console.log(player.child.feats.map(item => item.name));
        // Draw a card
        const hand = player.child.hand;
        hand.draw();
    }
}

