import { BattlecryModel, Selector, RoleModel, DamageModel, DamageType, DamageEvent } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('ironforge-rifleman-battlecry')
export class IronforgeRiflemanBattlecryModel extends BattlecryModel<RoleModel> {
    constructor(props?: IronforgeRiflemanBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Ironforge Rifleman's Battlecry",
                desc: "Deal 1 damage.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.roles; // Can target any character
        return new Selector(roles, { hint: "Choose a target" });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const minion = this.route.minion;
        if (!minion) return;
        // Deal 1 damage to the target
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: minion,
                method: this,
                target,
                origin: 1,
            })
        ]);
    }
}
