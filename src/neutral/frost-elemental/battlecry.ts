import { BattlecryModel, Selector, RoleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('frost-elemental-battlecry')
export class FrostElementalBattlecryModel extends BattlecryModel<RoleModel> {
    constructor(props?: FrostElementalBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Frost Elemental's Battlecry",
                desc: "Freeze a character.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        
        // Can target any character
        const roles = game.refer.roles;
        return new Selector(roles, { hint: "Choose a character" });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        // Freeze the target
        target.child.frozen.enable();
    }
}
