import { EffectModel, Selector, RoleModel, DamageModel, DamageEvent, RestoreModel, RestoreEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('holy-fire-effect')
export class HolyFireEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: HolyFireEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Holy Fire's effect",
                desc: "Deal *5* damage. Restore 5 Health to your hero.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles;
        return new Selector(roles, { hint: "Choose a target" });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        const player = this.route.player;
        if (!card || !player) return;

        // Deal 5 damage to the target
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 5,
            })
        ]);

        // Restore 5 Health to your hero
        const hero = player.child.hero;
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero,
                origin: 5,
            })
        ]);
    }
}
