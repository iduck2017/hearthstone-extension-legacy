import { BattlecryModel, DamageModel, DamageType, FilterType, RaceType, RoleModel, SelectForm } from "hearthstone-core";
import { HungryCrabBuffModel } from "./buff";

export class HungryCrabBattlecryModel extends BattlecryModel<[RoleModel]> {
    constructor(props: HungryCrabBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Hungry Crab\'s Battlecry',
                desc: 'Destroy a Murloc and gain +2/+2.',
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    public toRun(): [SelectForm<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.query({ 
            race: RaceType.MURLOC,
            isMinion: FilterType.INCLUDE,
        });
        if (options.length === 0) return;
        return [{ options, hint: 'Select a Murloc' }];
    }

    public async doRun(target: RoleModel) {
        const card = this.route.card;
        const role = this.route.role;
        if (!card) return;
        if (!role) return;
        // DamageModel.deal([{
        //     source: card.child.damage,
        //     target,
        //     damage: 0,
        //     result: 0,
        //     type: DamageType.DEFAULT,
        // }]);
        role.affect(new HungryCrabBuffModel({}))
    }
}