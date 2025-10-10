import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('shadow-word-ruin-effect')
export class ShadowWordRuinEffectModel extends SpellEffectModel<[]> {
    constructor(props?: ShadowWordRuinEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shadow Word: Ruin's effect",
                desc: "Destroy all minions with 5 or more Attack.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected async doRun() {
        const game = this.route.game;
        if (!game) return;

        // Get all minions (both friendly and enemy)
        const minions = game.query(true);
        // Destroy all minions with 5 or more Attack
        for (const role of minions) {
            if (role.child.attack.state.current >= 5) {
                const minion = role.route.minion;
                if (minion) {
                    minion.child.dispose.active(true, this.route.card, this);
                }
            }
        }
    }
}
