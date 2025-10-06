import { MinionCardModel, RoleBattlecryModel, RoleModel, SelectEvent } from "hearthstone-core";
import { AbusiveSergeantBuffModel } from "./buff";
import { DebugUtil, LogLevel, StoreUtil, Loader } from "set-piece";

@StoreUtil.is('abusive-sergeant-battlecry')
export class AbusiveSergeantBattlecryModel extends RoleBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<AbusiveSergeantBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Abusive Sergeant\'s Battlecry',
                    desc: '+2 Attack this turn.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    @DebugUtil.log()
    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.query(true);
        if (!options.length) return;
        return [new SelectEvent(options, { hint: 'Choose a minion' })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        target.child.feats.add(new AbusiveSergeantBuffModel())
    }
}