import { EffectModel, Selector, RoleModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { PowerInfusionBuffModel } from "./buff";

@TemplUtil.is('power-infusion-effect')
export class PowerInfusionEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: PowerInfusionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Power Infusion's effect",
                desc: "Give a minion +2/+6.",
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
        
        // Only target minions
        const roles = games.query(true);
        if (roles.length === 0) return; // No valid targets
        
        return [new Selector(roles, { hint: "Choose a minion" })];
    }

    protected async doRun(target: RoleModel) {
        const minion = target.route.minion;
        if (!minion) return;
        
        // Give the minion +2/+6 buff
        const buff = new PowerInfusionBuffModel();
        target.child.feats.add(buff);
    }
}
