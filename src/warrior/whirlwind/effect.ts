import { DamageEvent, DamageModel, DamageType, MinionCardModel, Selector, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('whirlwind-effect')
export class WhirlwindEffectModel extends SpellEffectModel<never> {
    constructor(props?: WhirlwindEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Whirlwind's effect",
                desc: "Deal *1* damage to ALL minions.",
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
        const game = this.route.game;
        if (!game) return;
        const card = this.route.card;
        if (!card) return;
        
        // Get all minions (both friendly and enemy)
        const minions = game.refer.minions;
        
        // Deal 1 damage to each minion
        DamageModel.deal(
            minions.map((item) => new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target: item,
                origin: 1,
            }))
        );
    }
}

