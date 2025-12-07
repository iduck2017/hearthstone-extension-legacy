import { Selector, MinionCardModel, SpellEffectModel, RoleBuffModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('humility-effect')
export class HumilityEffectModel extends SpellEffectModel<[MinionCardModel]> {
    constructor(props?: HumilityEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Humility's effect",
                desc: "Change a minion's Attack to 1.",
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
        // TODO: Change attack to 1
        // This requires setting the attack value directly, which may need a different approach
        // For now, we'll use a buff that sets attack to 1
        const currentAttack = target.child.attack.state.current;
        const buff = new RoleBuffModel({
            state: {
                name: "Humility's Buff",
                desc: "Attack changed to 1.",
                offset: [1 - currentAttack, 0]
            }
        });
        target.child.feats.add(buff);
    }
}

