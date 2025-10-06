import { RaceType, RoleBattlecryModel, RoleModel, SelectEvent } from "hearthstone-core";
import { HungryCrabBuffModel } from "./buff";
import { StoreUtil, Loader, DebugUtil, LogLevel } from "set-piece";

@StoreUtil.is('hungry-crab-battlecry')
export class HungryCrabBattlecryModel extends RoleBattlecryModel<[RoleModel]> {
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
        const options = game.query(true).filter(item => (
            item.route.minion?.state.races.includes(RaceType.MURLOC)
        ));
        console.log(options);
        return [new SelectEvent(options, { hint: 'Select a Murloc' })];
    }

    @DebugUtil.log(LogLevel.WARN)
    public async doRun(from: number, to: number, target: RoleModel) {
        const role = this.route.role;
        if (!role) return;
        
        // Destroy the target murloc
        const card = target.route.minion;
        if (!card) return;
        card.child.dispose.active(true, this.route.card, this);
        
        // Add buff to the crab
        role.add(new HungryCrabBuffModel());
    }
}