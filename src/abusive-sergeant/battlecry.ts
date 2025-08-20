import { BattlecryModel, FilterType, MinionCardModel, RoleModel } from "hearthstone-core";
import { SelectForm } from "hearthstone-core/dist/type/utils/select";
import { AbusiveSergeantBuffModel } from "./buff";
import { DebugUtil, LogLevel } from "set-piece";

export class AbusiveSergeantBattlecryModel extends BattlecryModel<
    [RoleModel],
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

    @DebugUtil.log()
    public toRun(): [SelectForm<RoleModel>] | undefined {
        if (!this.route.game) return;
        const options = this.route.game.query({
            isMinion: FilterType.INCLUDE,
        })
        if (!options.length) return;
        return [{ options, hint: 'Choose a minion' }];
    }

    public async doRun(target: RoleModel) {
        target.affect(new AbusiveSergeantBuffModel({}))
    }
}