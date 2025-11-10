import { MinionBattlecryModel, Selector, RoleModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('spellbreaker-battlecry')
export class SpellbreakerBattlecryModel extends MinionBattlecryModel<[MinionCardModel]> {
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

    public toRun(): [Selector<MinionCardModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true); // Can only target minions
        return [new Selector(roles, { hint: "Choose a minion to silence" })];
    }

    public async doRun(from: number, to: number, target: MinionCardModel) {
        // Silence the target minion
        target.silence();
    }
}
