import { Selector, MinionCardModel, SpellEffectModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('blessed-champion-effect')
export class BlessedChampionEffectModel extends SpellEffectModel<[MinionCardModel]> {
    constructor(props?: BlessedChampionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blessed Champion's effect",
                desc: "Double a minion's Attack.",
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
        const currentAttack = target.child.attack.state.current;
        const buff = new RoleBuffModel({
            state: {
                name: "Blessed Champion's Buff",
                desc: "Attack doubled.",
                offset: [currentAttack, 0]
            }
        });
        target.child.feats.add(buff);
    }
}

