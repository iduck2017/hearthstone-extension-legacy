import { BattlecryModel, RestoreEvent, RestoreModel, RoleModel, Selector } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('voodoo-doctor-battlecry')
export class VoodooDoctorMinionBattlecryModel extends BattlecryModel<RoleModel> {
    constructor(props?: VoodooDoctorMinionBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Voodoo Doctor\'s Battlecry',
                desc: 'Restore 2 Health.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.roles;
        return new Selector(roles, { hint: 'Choose a target' });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const minion = this.route.minion;
        if (!minion) return;
        RestoreModel.deal([
            new RestoreEvent({
                source: minion,
                method: this,
                target: target,
                origin: 2,
            })
        ]);
    }
}