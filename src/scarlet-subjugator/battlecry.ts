import { RoleBattlecryModel, SelectEvent, RoleModel } from "hearthstone-core";
import { Loader, StoreUtil, TranxUtil } from "set-piece";
import { ScarletSubjugatorDebuffModel } from "./debuff";

@StoreUtil.is('scarlet-subjugator-battlecry')
export class ScarletSubjugatorBattlecryModel extends RoleBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<ScarletSubjugatorBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Scarlet Subjugator\'s Battlecry',
                    desc: 'Give an enemy minion -2 Attack until your next turn.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        
        // Only target enemy minions
        const roles = opponent.query(true)
        if (roles.length === 0) return; // No valid targets
        
        return [new SelectEvent(roles, { hint: "Choose an enemy minion" })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        const player = this.route.player;
        if (!player) return;
        // Apply -2 Attack debuff until next turn
        this.debuff(target);
    }

    @TranxUtil.span()
    private debuff(target: RoleModel) {
        const player = this.route.player;
        if (!player) return;
        const debuff = new ScarletSubjugatorDebuffModel(() => ({ refer: { player }}));
        target.add(debuff);
    }
}
