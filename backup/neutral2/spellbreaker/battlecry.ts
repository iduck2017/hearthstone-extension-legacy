import { BattlecryModel, Selector, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('spellbreaker-battlecry')
export class SpellbreakerBattlecryModel extends BattlecryModel<MinionCardModel> {
    constructor(props?: SpellbreakerBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Spellbreaker's Battlecry",
                desc: "Silence a minion.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public prepare(): Selector<MinionCardModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.minions; // Can only target minions
        return new Selector(roles, { hint: "Choose a minion to silence" });
    }

    public run(params: MinionCardModel[]) {
        const target = params[0];
        if (!target) return;
        // Silence the target minion
        target.silence();
    }
}
