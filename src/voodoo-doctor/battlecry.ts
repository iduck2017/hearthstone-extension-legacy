import { BattlecryModel, RoleModel, SelectForm } from "hearthstone-core";

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

    public toRun(): [SelectForm<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.query({});
        if (!options.length) return;
        return [{ options, hint: 'Choose a target' }];
    }

    public async doRun(target: RoleModel) {
        const game = this.route.game;
        if (!game) return;
    }
}