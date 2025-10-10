import { MinionBattlecryModel, DamageEvent, DamageModel, DamageType, RoleModel, SelectEvent } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";

@TemplUtil.is('elven-archer-battlecry')
export class ElvenArcherMinionBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<ElvenArcherMinionBattlecryModel>) {
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
        const roles = game.query();
        return [new SelectEvent(roles, { hint: 'Choose a target' })]
    }

    protected async doRun(from: number, to: number, target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        DamageModel.run([
            new DamageEvent({
                source: card,
                target,
                method: this,
                origin: 1,
                type: DamageType.DEFAULT,
            })
        ])
    }
}