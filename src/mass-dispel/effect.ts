import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('mass-dispel-effect')
export class MassDispelEffectModel extends SpellEffectModel<[]> {
    constructor(props?: MassDispelEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mass Dispel's effect",
                desc: "Silence all enemy minions. Draw a card.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;

        // Get all enemy minions
        const enemies = opponent.query(true);
        
        // Silence all enemy minions
        for (const item of enemies) {
            item.silence();
        }

        // Draw a card
        const deck = player.child.deck;
        deck.draw();
    }
}
