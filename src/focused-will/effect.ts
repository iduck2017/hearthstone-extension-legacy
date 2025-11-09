import { EffectModel, Selector, RoleModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { FocusedWillBuffModel } from "./buff";

@TemplUtil.is('focused-will-effect')
export class FocusedWillEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: FocusedWillEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Focused Will's effect",
                desc: "Silence a minion, then give it +3 Health.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [Selector<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true); // Only minions can be targeted
        return [new Selector(roles, { hint: "Choose a minion" })];
    }

    protected async doRun(target: RoleModel) {
        const minion = target.route.minion;
        if (!minion) return;

        // First, silence the minion
        minion.silence();

        // Then, give it +3 Health buff
        const buff = new FocusedWillBuffModel();
        target.child.feats.add(buff);
    }
}
