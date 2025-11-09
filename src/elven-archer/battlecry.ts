import { MinionBattlecryModel, DamageEvent, DamageModel, DamageType, RoleModel, Selector } from "hearthstone-core";
import { TemplUtil } from "set-piece";

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

    protected async doRun(from: number, to: number, target: RoleModel) {
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