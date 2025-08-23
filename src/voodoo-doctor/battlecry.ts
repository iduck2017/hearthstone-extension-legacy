import { BattlecryModel, RoleModel, SelectEvent } from "hearthstone-core";

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
        const player = this.route.player;
        if (!player) return;
        const options = player.refer.roles;
        if (!options.length) return;
        return [new SelectEvent(options, { hint: 'Choose a target' })];
    }

    public async doRun(target: RoleModel) {
        const game = this.route.game;
        if (!game) return;
    }
}