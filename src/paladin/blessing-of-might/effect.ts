import { Selector, SpellEffectModel, MinionCardModel, BaseFeatureModel, RoleAttackBuffModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('blessing-of-might-effect')
export class BlessingOfMightEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: BlessingOfMightEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blessing of Might's effect",
                desc: "Give a minion +3 Attack.",
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

        // Give the minion +3 Attack buff
        target.buff(new BaseFeatureModel({
            state: {
                name: "Blessing of Might's Buff",
                desc: "+3 Attack.",
            },
            child: {
                buffs: [new RoleAttackBuffModel({ state: { offset: 3 } })]
            },
        }));
    }
}

