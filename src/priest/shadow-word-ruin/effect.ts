import { EffectModel, SpellEffectModel, Selector, MinionCardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('shadow-word-ruin-effect')
export class ShadowWordRuinEffectModel extends SpellEffectModel<never> {
    constructor(props?: ShadowWordRuinEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shadow Word: Ruin's effect",
                desc: "Destroy all minions with 5 or more Attack.",
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
        const game = this.route.game;
        if (!game) return;

        // Get all minions (both friendly and enemy)
        const minions = game.refer.minions;
        const card = this.route.card;
        if (!card) return;
        // Destroy all minions with 5 or more Attack
        for (const role of minions) {
            if (role.child.attack.state.current >= 5) {
                role.child.dispose.destroy(card, this);
            }
        }
    }
}
