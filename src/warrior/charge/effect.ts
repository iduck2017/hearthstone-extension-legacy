import { Selector, SpellEffectModel, RoleBuffModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('charge-effect')
export class ChargeEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: ChargeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Charge's effect",
                desc: "Give a friendly minion +2 Attack and Charge.",
                damage: [],
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
        const buff = new RoleBuffModel({
            state: {
                name: "Charge's Buff",
                desc: "+2 Attack.",
                offset: [2, 0] // +2 Attack, +0 Health
            }
        });
        target.buff(buff);
        // Give the minion Charge ability
        const charge = target.child.charge;
        charge.enable();
    }
}

