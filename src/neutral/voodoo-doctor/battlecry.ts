import { BattlecryModel, RestoreEvent, RestoreModel, RoleModel, Selector } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('voodoo-doctor-battlecry')
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

    public prepare(): Selector<RoleModel> | undefined {
        console.log('🔍 prepare')
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.roles;
        return new Selector(roles, { hint: 'Choose a target' });
    }

    public run(target: RoleModel) {
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