import { AnchorEvent, BattlecryModel, DamageType, RaceType, RoleModel, SelectEvent } from "hearthstone-core";
import { HungryCrabBuffModel } from "./buff";
import { StoreUtil } from "set-piece";

@StoreUtil.is('hungry-crab-battlecry')
export class HungryCrabBattlecryModel extends BattlecryModel<[RoleModel]> {
    constructor(props: HungryCrabBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Hungry Crab\'s Battlecry',
                desc: 'Destroy a Murloc and gain +2/+2.',
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.refer.minions.filter(item => {
            const card = item.route.card;
            const minion = card?.child.minion;
            if (!minion) return false;
            return minion.state.races.includes(RaceType.MURLOC);
        });
        if (options.length === 0) return;
        return [new SelectEvent(options, { hint: 'Select a Murloc' })];
    }

    public async doRun(target: RoleModel) {
        const card = this.route.card;
        const minion = card?.child.minion;
        if (!minion) return;
        if (!card) return;
        target.child.death.destroy(new AnchorEvent({ source: this.child.anchor }));
        minion.child.features.add(new HungryCrabBuffModel({}))
    }
}