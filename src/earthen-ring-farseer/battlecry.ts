import { MinionBattlecryModel, SelectEvent, RoleModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('earthen-ring-farseer-battlecry')
export class EarthenRingFarseerBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<EarthenRingFarseerBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Earthen Ring Farseer's Battlecry",
                    desc: "Restore 3 Health.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(); // All characters
        return [new SelectEvent(roles, { hint: "Choose a target to restore 3 health" })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        // Restore 3 health to the selected target
        const card = this.route.card;
        if (!card) return;
        RestoreModel.run([
            new RestoreEvent({
                source: card,
                target: target,
                method: this,
                origin: 3,
            })]
        );
    }
} 