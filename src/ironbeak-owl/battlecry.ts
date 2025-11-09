import { MinionBattlecryModel, Selector, RoleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('ironbeak-owl-battlecry')
export class IronbeakOwlBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(props?: IronbeakOwlBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Ironbeak Owl's Battlecry",
                desc: "Silence a minion.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [Selector<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true); // Can only target minions
        return [new Selector(roles, { hint: "Choose a minion to silence" })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        // Silence the target minion
        const minion = target.route.minion;
        if (!minion) return;
        minion.silence();
    }
}
