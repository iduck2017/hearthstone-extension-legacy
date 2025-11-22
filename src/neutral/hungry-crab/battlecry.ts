import { RaceType, BattlecryModel, RoleModel, Selector, RoleBuffModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil, DebugUtil } from "set-piece";

@TemplUtil.is('hungry-crab-battlecry')
export class HungryCrabBattlecryModel extends BattlecryModel<RoleModel> {
    constructor(props?: HungryCrabBattlecryModel['props']) {
        props = props ?? {};
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

    public precheck(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.refer.minions.filter(item => (
            item instanceof MinionCardModel && item.state.races.includes(RaceType.MURLOC)
        ));
        return new Selector(options, { hint: 'Select a Murloc' });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        console.log(params);
        const target = params[0];
        if (!target) return;

        // Destroy the target murloc
        const minion = this.route.minion;
        if (!minion) return;
        target.child.dispose.destroy(minion, this);
        
        // Add buff to the crab
        minion.buff(new RoleBuffModel({
            state: {
                name: "Hungry Crab's Buff",
                desc: "+2/+2",
                offset: [2, 2]
            }
        }));
    }
}