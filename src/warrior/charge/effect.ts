import { Selector, SpellEffectModel, BaseFeatureModel, RoleAttackBuffModel, MinionCardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('charge-effect')
export class ChargeEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: ChargeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Charge's effect",
                desc: "Give a friendly minion +2 Attack and Charge.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const player = this.route.player;
        if (!player) return;
        const roles = player.refer.minions;
        return new Selector(roles, { 
            hint: "Choose a friendly minion" 
        });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;

        // Give the minion +2 Attack buff
        target.buff(new BaseFeatureModel({
            state: {
                name: "Charge's Buff",
                desc: "+2 Attack.",
            },
            child: {
                buffs: [new RoleAttackBuffModel({ state: { offset: 2 } })]
            },
        }));
        // Give the minion Charge ability
        const charge = target.child.charge;
        charge.enable();
    }
}

