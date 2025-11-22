import { BattlecryModel, Selector, RoleModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('earthen-ring-farseer-battlecry')
export class EarthenRingFarseerBattlecryModel extends BattlecryModel<RoleModel> {
    constructor(props?: EarthenRingFarseerBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Earthen Ring Farseer's Battlecry",
                desc: "Restore 3 Health.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public prepare(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.roles; // All characters
        return new Selector(roles, { hint: "Choose a target to restore 3 health" });
    }

    public run(params: RoleModel[]) {
        const target = params[0];
        if (!target) return;
        // Restore 3 health to the selected target
        const minion = this.route.minion;
        if (!minion) return;
        RestoreModel.deal([
            new RestoreEvent({
                source: minion,
                target: target,
                method: this,
                origin: 3,
            })
        ]);
    }
} 