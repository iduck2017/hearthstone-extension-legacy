import { BattlecryModel, Selector, RoleModel } from "hearthstone-core";
import { TemplUtil, TranxUtil } from "set-piece";
import { ScarletSubjugatorDebuffModel } from "./debuff";

@TemplUtil.is('scarlet-subjugator-battlecry')
export class ScarletSubjugatorBattlecryModel extends BattlecryModel<RoleModel> {
    constructor(props?: ScarletSubjugatorBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Scarlet Subjugator\'s Battlecry',
                desc: 'Give an enemy minion -2 Attack until your next turn.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<RoleModel> | undefined {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        
        // Only target enemy minions
        const roles = opponent.refer.minions;
        if (roles.length === 0) return; // No valid targets
        
        return new Selector(roles, { hint: "Choose an enemy minion" });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const player = this.route.player;
        if (!player) return;
        // Apply -2 Attack debuff until next turn
        this.debuff(target);
    }

    @TranxUtil.span()
    private debuff(target: RoleModel) {
        const game = this.route.game;
        if (!game) return;
        const turn = game.child.turn;
        const current = turn.state.current;
        const debuff = new ScarletSubjugatorDebuffModel({ state: { count: current + 2 }});
        target.buff(debuff);
    }
}
