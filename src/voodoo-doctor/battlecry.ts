import { RoleBattlecryModel, RestoreEvent, RestoreModel, RoleModel, SelectEvent } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('voodoo-doctor-battlecry')
export class VoodooDoctorRoleBattlecryModel extends RoleBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<VoodooDoctorRoleBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Voodoo Doctor\'s Battlecry',
                    desc: 'Restore 2 Health.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;

        const options = game.refer.roles;
        if (!options.length) return;
        return [new SelectEvent(options, { hint: 'Choose a target' })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        RestoreModel.run([
            new RestoreEvent({
                source: card,
                detail: this,
                target: target,
                origin: 2,
            })
        ]);
    }
}