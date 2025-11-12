import { Selector, RoleModel, MinionCardModel, SpellEffectModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('blessing-of-might-effect')
export class BlessingOfMightEffectModel extends SpellEffectModel<[MinionCardModel]> {
    constructor(props?: BlessingOfMightEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blessing of Might's effect",
                desc: "Give a minion +3 Attack.",
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
        const roles = games.query(true);
        return [new Selector(roles, { hint: "Choose a minion" })]
    }

    protected doRun(target: MinionCardModel) {
        const buff = new RoleBuffModel({
            state: {
                name: "Blessing of Might's Buff",
                desc: "+3 Attack.",
                offset: [3, 0] // +3 Attack, +0 Health
            }
        });
        target.child.feats.add(buff);
    }
}

