import { Selector, SpellEffectModel, BaseFeatureModel, RoleAttackBuffModel, RoleHealthBuffModel, MinionCardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('power-infusion-effect')
export class PowerInfusionEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: PowerInfusionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Power Infusion's effect",
                desc: "Give a minion +2/+6.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        
        // Only target minions
        const roles = games.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        // Give the minion +2/+6 buff
        target.buff(new BaseFeatureModel({
            state: {
                name: "Power Infusion's Buff",
                desc: "+2/+6.",
            },
            child: {
                buffs: [
                    new RoleAttackBuffModel({ state: { offset: 2 } }),
                    new RoleHealthBuffModel({ state: { offset: 6 } })
                ]
            },
        }));
    }
}
