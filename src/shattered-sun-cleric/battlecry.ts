import { BattlecryModel, RoleModel, SelectEvent } from "hearthstone-core";
import { ShatteredSunClericBuffModel } from "./buff";
import { DebugUtil, StoreUtil } from "set-piece";

@StoreUtil.is('shattered-sun-cleric-battlecry')
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

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const player = this.route.player;
        if (!player) return;
        const options = player.refer.minions;
        if (options.length === 0) return;
        return [new SelectEvent(options, { hint: 'Choose a friendly minion' })]
    }

    @DebugUtil.log()
    public async doRun(target: RoleModel) {
        target.child.features.add(new ShatteredSunClericBuffModel({}))
    }
}