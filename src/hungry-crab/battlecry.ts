import { BattlecryModel, RaceType, RoleModel, SelectEvent } from "hearthstone-core";
import { HungryCrabBuffModel } from "./buff";
import { StoreUtil, Loader, DebugUtil, LogLevel } from "set-piece";

@StoreUtil.is('hungry-crab-battlecry')
export class HungryCrabBattlecryModel extends BattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<HungryCrabBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Hungry Crab\'s Battlecry',
                    desc: 'Destroy a Murloc and gain +2/+2.',
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.refer.minions.filter(item => (
            item.route.minion?.state.races.includes(RaceType.MURLOC)
        ));
        if (options.length === 0) return;
        return [new SelectEvent(options, { hint: 'Select a Murloc' })];
    }

    @DebugUtil.log(LogLevel.WARN)
    public async doRun(role: RoleModel) {
        const minion = this.route.minion;
        if (!minion) return;
        
        // Destroy the target murloc
        const target = role.route.minion;
        if (!target) return;
        target.child.dispose.active(this, true);
        
        // Add buff to the crab
        minion.child.role.child.feats.add(new HungryCrabBuffModel());
    }
}