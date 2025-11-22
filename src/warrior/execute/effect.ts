import { Selector, SpellEffectModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('execute-effect')
export class ExecuteEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: ExecuteEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Execute's effect",
                desc: "Destroy a damaged enemy minion.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        
        // Only target damaged enemy minions
        const roles = opponent.refer.minions.filter(minion => {
            const health = minion.child.health;
            return health.state.isInjured;
        });
        return new Selector(roles, { 
            hint: "Choose a damaged enemy minion",
        });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        
        // Destroy the damaged enemy minion
        const card = this.route.card;
        if (!card) return;
        target.child.dispose.destroy(card, this);
    }
}

