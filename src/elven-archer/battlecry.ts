import { MinionCardModel, BattlecryModel, RoleModel, SelectForm, DamageForm, DamageType, DamageModel } from "hearthstone-core";

export class ElvenArcherBattlecryModel extends BattlecryModel<[RoleModel]> {
    constructor(props: ElvenArcherBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Elven Archer Battlecry',
                desc: 'Deal 1 damage.',
                ...props.state,
            },
            child: {
                damage: new DamageModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    public toRun(): [SelectForm<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.query({})
        if (options.length === 0) return;
        return [{ options, hint: 'Choose a target' }]
    }

    public async doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        DamageModel.deal([{
            source: card.child.damage,
            target,
            damage: 1,
            result: 1,
            type: DamageType.DEFAULT,
        }])
    }
}