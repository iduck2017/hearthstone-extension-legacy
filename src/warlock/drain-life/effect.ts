import { Selector, SpellEffectModel, RoleModel, DamageModel, DamageEvent, DamageType, RestoreModel, RestoreEvent } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('drain-life-effect')
export class DrainLifeEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: DrainLifeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Drain Life's effect",
                desc: "Deal 2 damage. Restore 2 Health to your hero.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.roles;
        return new Selector(roles, { hint: "Choose a target" });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;
        const player = this.route.player;
        if (!player) return;
        const hero = player.child.hero;

        // Deal 2 damage to the target
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 2,
            })
        ]);

        // Restore 2 Health to your hero
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero,
                origin: 2,
            })
        ]);
    }
}

