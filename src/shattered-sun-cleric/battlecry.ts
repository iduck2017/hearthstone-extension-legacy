import { BattlecryModel, MinionRoleModel, TargetType, Selector } from "hearthstone-core";
import { ShatteredSunClericEffectModel } from "./buff";
import { DebugUtil } from "set-piece";

export class ShatteredSunClericBattlecryModel extends BattlecryModel<
    [MinionRoleModel]
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

    public preparePlay(): [Selector<MinionRoleModel>] | undefined {
        if (!this.route.game) return;
        const candidates = this.route.game.query(TargetType.MinionRole, { 
            side: this.route.owner 
        })
        if (candidates.length === 0) return;
        return [new Selector(candidates, 'Choose a friendly minion')]
    }

    @DebugUtil.log()
    public async run(target: MinionRoleModel) {
        target.affect(new ShatteredSunClericEffectModel({}))
    }
}