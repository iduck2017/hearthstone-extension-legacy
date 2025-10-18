import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, RestoreModel, RestoreEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('holy-fire-effect')
export class HolyFireEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: HolyFireEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Holy Fire's effect",
                desc: "Deal {{spellDamage[0]}} damage. Restore 5 Health to your hero.",
                damage: [5],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(); // Can target any character
        return [new SelectEvent(roles, { hint: "Choose a target" })];
    }

    protected async doRun(target: RoleModel) {
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
                origin: this.state.damage[0] ?? 0,
            })
        ]);

        // Restore 5 Health to your hero
        const hero = player.child.hero;
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero.child.role,
                origin: 5,
            })
        ]);
    }
}
