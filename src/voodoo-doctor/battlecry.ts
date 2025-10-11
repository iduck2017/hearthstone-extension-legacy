import { MinionBattlecryModel, RestoreEvent, RestoreModel, RoleModel, SelectEvent } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('voodoo-doctor-battlecry')
export class VoodooDoctorMinionBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
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

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.query();
        return [new SelectEvent(roles, { hint: 'Choose a target' })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: target,
                origin: 2,
            })
        ]);
    }
}