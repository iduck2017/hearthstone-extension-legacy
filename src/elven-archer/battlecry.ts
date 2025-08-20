import { MinionCardModel, BattlecryModel, RoleModel, SelectForm, DamageForm, DamageType, DamageModel } from "hearthstone-core";

export namespace ElvenArcherBattlecryModel {
    export type Event = {};
    export type State = {};
    export type Child = {
        damage: DamageModel;
    }
    export type Refer = {};
}

export class ElvenArcherBattlecryModel extends BattlecryModel<
    [RoleModel],
    ElvenArcherBattlecryModel.Event,
    ElvenArcherBattlecryModel.State,
    ElvenArcherBattlecryModel.Child,
    ElvenArcherBattlecryModel.Refer
> {
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
        DamageModel.deal([{
            source: this.child.damage,
            target,
            damage: 1,
            result: 1,
            type: DamageType.DEFAULT,
        }])
    }
}