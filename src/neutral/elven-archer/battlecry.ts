import { MinionBattlecryModel, DamageEvent, DamageModel, DamageType, RoleModel, Selector } from "hearthstone-core";
import { DebugUtil, TemplUtil } from "set-piece";

@TemplUtil.is('elven-archer-battlecry')
export class ElvenArcherMinionBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(props?: ElvenArcherMinionBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Elven Archer Battlecry',
                desc: 'Deal 1 damage.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [Selector<RoleModel>] | undefined {
        const player = this.route.player;
        const game = this.route.game;
        if (!game) return;
        if (!player) return;
        const roles = game.query();
        return [new Selector(roles, { hint: 'Choose a target' })]
    }

    protected doRun(from: number, to: number, target: RoleModel) {
        DebugUtil.log(`${this.name} deals 1 damage to ${target.name}`);
        const card = this.route.card;
        if (!card) return;
        DamageModel.deal([
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