import { EffectModel, SpellEffectModel, Selector, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('shadow-word-ruin-effect')
export class ShadowWordRuinEffectModel extends SpellEffectModel<never> {
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

    public prepare(...prev: never[]): Selector<never> | undefined {
        return undefined;
    }

    protected run() {
        const game = this.route.game;
        if (!game) return;

        // Get all minions (both friendly and enemy)
        const minions = game.refer.roles.filter(role => role instanceof MinionCardModel);
        // Destroy all minions with 5 or more Attack
        for (const role of minions) {
            if (role.child.attack.state.current >= 5) {
                role.child.dispose.active(true, this.route.card, this);
            }
        }
    }
}
