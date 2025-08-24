import { BattlecryModel, RestoreEvent, RestoreUtil, RoleModel, SelectEvent } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('earthen-ring-farseer-battlecry')
export class EarthenRingFarseerBattlecryModel extends BattlecryModel<[RoleModel]> {
    constructor(props: EarthenRingFarseerBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Earthen Ring Farseer\'s Battlecry',
                desc: 'Restore 3 Health.',
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
        const options = game.refer.roles.filter(item => item !== minion);
        if (!options.length) return;
        return [new SelectEvent(options, { hint: 'Choose a target' })];
    }

    public async doRun(target: RoleModel) {
        // Restore 3 health to the selected target
        RestoreUtil.run([new RestoreEvent({
            source: this.child.anchor,
            target: target,
            origin: 3,
        })]);
    }
} 