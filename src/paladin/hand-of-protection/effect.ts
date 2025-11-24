import { Selector, SpellEffectModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('hand-of-protection-effect')
export class HandOfProtectionEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: HandOfProtectionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Hand of Protection's effect",
                desc: "Give a minion Divine Shield.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;

        // Give the minion Divine Shield
        const divineShield = target.child.divineShield;
        divineShield.enable();
    }
}

