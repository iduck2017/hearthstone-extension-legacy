import { Selector, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('battle-rage-effect')
export class BattleRageEffectModel extends SpellEffectModel<never> {
    constructor(props?: BattleRageEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Battle Rage's effect",
                desc: "Draw a card for each damaged friendly character.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const hand = player.child.hand;
        
        // Count damaged friendly characters (hero and minions)
        const roles = player.refer.roles.filter(role => {
            const health = role.child.health;
            return health.state.isInjured;
        });
        
        // Draw a card for each damaged friendly character
        for (let i = 0; i < roles.length; i++) {
            hand.draw();
        }
    }
}

