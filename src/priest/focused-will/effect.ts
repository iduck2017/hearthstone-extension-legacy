import { EffectModel, Selector, RoleModel, SpellEffectModel, MinionCardModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('focused-will-effect')
export class FocusedWillEffectModel extends SpellEffectModel<[MinionCardModel]> {
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

    toRun(): [Selector<MinionCardModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true); // Only minions can be targeted
        return [new Selector(roles, { hint: "Choose a minion" })];
    }

    protected doRun(target: MinionCardModel) {
        // First, silence the minion
        target.silence();

        // Then, give it +3 Health buff
        const buff = new RoleBuffModel({
            state: {
                name: "Focused Will's Buff",
                desc: "+3 Health.",
                offset: [0, 3] // +0 Attack, +3 Health
            }
        });
        target.child.feats.add(buff);
    }
}
