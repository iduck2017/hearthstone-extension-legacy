import { MinionCardModel, BattlecryModel, TargetType, Selector } from "hearthstone-core";
import { AbusiveSergeantEffectModel } from "./effect";
import { MinionRoleModel } from "hearthstone-core";

export class AbusiveSergeantBattlecryModel extends BattlecryModel<
    [MinionRoleModel],
    MinionCardModel
> {
    constructor(props: AbusiveSergeantBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Battlecry',
                desc: 'Give a minion +2 Attack this turn.',
                ...props.state,
            },
            child: {},
            refer: {}
        });
    }

    public preparePlay(): [Selector<MinionRoleModel>] | undefined {
        if (!this.route.game) return;
        const candidates = this.route.game.query(TargetType.MinionRole, {})
        if (!candidates.length) return;
        return [new Selector(candidates, 'Choose a minion')];
    }

    public async run(target: MinionRoleModel) {
        target.affect(new AbusiveSergeantEffectModel({}))
    }
}