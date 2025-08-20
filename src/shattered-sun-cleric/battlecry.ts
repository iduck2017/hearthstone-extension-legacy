import { BattlecryModel, FilterType, RoleModel, SelectForm } from "hearthstone-core";
import { ShatteredSunClericBuffModel } from "./buff";
import { DebugUtil } from "set-piece";

export class ShatteredSunClericBattlecryModel extends BattlecryModel<
    [RoleModel]
> {
    constructor(props: ShatteredSunClericBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Shattered Sun Cleric\'s Battlecry',
                desc: 'Give a friendly minion +1/+1.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [SelectForm<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.query({ 
            side: this.route.player,
            isMinion: FilterType.INCLUDE,
        })
        if (options.length === 0) return;
        return [{ options, hint: 'Choose a friendly minion' }]
    }

    @DebugUtil.log()
    public async doRun(target: RoleModel) {
        target.affect(new ShatteredSunClericBuffModel({}))
    }
}