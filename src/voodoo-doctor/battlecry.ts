import { BattlecryModel, RestoreEvent, RestoreUtil, RoleModel, SelectEvent } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('voodoo-doctor-battlecry')
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
        const minion = card.child.minion;
        const options = game.refer.minions.filter(item => item !== minion);
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