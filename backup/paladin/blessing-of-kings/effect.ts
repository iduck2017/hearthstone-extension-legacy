import { Selector, MinionCardModel, SpellEffectModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('blessing-of-kings-effect')
export class BlessingOfKingsEffectModel extends SpellEffectModel<[MinionCardModel]> {
    constructor(props?: BlessingOfKingsEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blessing of Kings's effect",
                desc: "Give a minion +4/+4.",
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
                name: "Blessing of Kings's Buff",
                desc: "+4/+4.",
                offset: [4, 4] // +4 Attack, +4 Health
            }
        });
        target.child.feats.add(buff);
    }
}

