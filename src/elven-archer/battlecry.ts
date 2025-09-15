import { RoleBattlecryModel, DamageEvent, DamageModel, DamageType, RoleModel, SelectEvent } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('elven-archer-battlecry')
export class ElvenArcherRoleBattlecryModel extends RoleBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<ElvenArcherRoleBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Elven Archer Battlecry',
                    desc: 'Deal 1 damage.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const player = this.route.player;
        const game = this.route.game;
        if (!game) return;
        if (!player) return;
        const options = game.refer.roles;
        if (options.length === 0) return;
        return [new SelectEvent(options, { hint: 'Choose a target' })]
    }

    protected async doRun(from: number, to: number, target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        DamageModel.run([
            new DamageEvent({
                source: card,
                target,
                detail: this,
                origin: 1,
                type: DamageType.DEFAULT,
            })
        ])
    }
}