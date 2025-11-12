import { MinionBattlecryModel, Selector, RoleModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('earthen-ring-farseer-battlecry')
export class EarthenRingFarseerBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
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

    public toRun(): [Selector<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(); // All characters
        return [new Selector(roles, { hint: "Choose a target to restore 3 health" })];
    }

    public doRun(from: number, to: number, target: RoleModel) {
        // Restore 3 health to the selected target
        const card = this.route.card;
        if (!card) return;
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                target: target,
                method: this,
                origin: 3,
            })]
        );
    }
} 