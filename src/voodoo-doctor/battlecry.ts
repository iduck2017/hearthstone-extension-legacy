import { BattlecryModel, RestoreEvent, RestoreUtil, RoleModel, SelectEvent } from "hearthstone-core";

export class VoodooDoctorBattlecryModel extends BattlecryModel<[RoleModel]> {
    constructor(props: VoodooDoctorBattlecryModel['props']) {
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
        const card = this.route.card;
        if (!card) return;
        const role = card.child.role;
        const options = game.refer.roles.filter(item => item !== role);
        if (!options.length) return;
        return [new SelectEvent(options, { hint: 'Choose a target' })];
    }

    public async doRun(target: RoleModel) {
        RestoreUtil.run([new RestoreEvent({
            source: this.child.anchor,
            target: target,
            origin: 2,
        })]);
    }
}