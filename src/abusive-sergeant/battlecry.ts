import { BattlecryModel, MinionModel, RoleModel, SelectEvent } from "hearthstone-core";
import { AbusiveSergeantBuffModel } from "./buff";
import { DebugUtil, LogLevel, StoreUtil } from "set-piece";

@StoreUtil.is('abusive-sergeant-battlecry')
export class AbusiveSergeantBattlecryModel extends BattlecryModel<
    [RoleModel],
    MinionModel
> {
    constructor(props: AbusiveSergeantBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Battlecry',
                desc: '+2 Attack this turn.',
                ...props.state,
            },
            child: {},
            refer: {}
        });
    }

    @DebugUtil.log()
    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.refer.minions;
        if (!options.length) return;
        return [new SelectEvent(options, { hint: 'Choose a minion' })];
    }

    public async doRun(target: RoleModel) {
        target.child.features.add(new AbusiveSergeantBuffModel({}))
    }
}