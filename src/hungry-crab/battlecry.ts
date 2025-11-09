import { RaceType, MinionBattlecryModel, RoleModel, Selector } from "hearthstone-core";
import { HungryCrabBuffModel } from "./buff";
import { TemplUtil, DebugUtil } from "set-piece";

@TemplUtil.is('hungry-crab-battlecry')
export class HungryCrabBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
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

    public toRun(): [Selector<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.query(true).filter(item => (
            item.route.minion?.state.races.includes(RaceType.MURLOC)
        ));
        return [new Selector(options, { hint: 'Select a Murloc' })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        const cardA = this.route.minion;
        if (!cardA) return;
        
        // Destroy the target murloc
        const cardB = target.route.minion;
        if (!cardB) return;
        console.log('kill', cardB.name);
        cardB.child.dispose.active(true, this.route.card, this);
        
        // Add buff to the crab
        const role = cardA.child.role;
        role.child.feats.add(new HungryCrabBuffModel());
    }
}