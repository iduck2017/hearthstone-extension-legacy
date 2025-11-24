import { EffectModel, SpellEffectModel, Selector } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('mass-dispel-effect')
export class MassDispelEffectModel extends SpellEffectModel<never> {
    constructor(props?: MassDispelEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mass Dispel's effect",
                desc: "Silence all enemy minions. Draw a card.",
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
        const opponent = player?.refer.opponent;
        if (!opponent) return;

        // Get all enemy minions
        const enemies = opponent.refer.minions;
        
        // Silence all enemy minions
        for (const item of enemies) {
            item.silence();
        }

        // Draw a card
        const hand = player.child.hand;
        hand.draw();
    }
}
