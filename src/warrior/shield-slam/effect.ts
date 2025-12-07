import { Selector, DamageModel, DamageEvent, DamageType, SpellEffectModel, MinionCardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('shield-slam-effect')
export class ShieldSlamEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: ShieldSlamEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shield Slam's effect",
                desc: "Deal 1 damage to a minion for each Armor you have.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;
        const player = this.route.player;
        if (!player) return;

        // Get hero's armor value
        const hero = player.child.hero;
        const armor = hero.child.armor;

        // Deal damage equal to armor amount
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: armor.state.current,
            })
        ]);
    }
}

