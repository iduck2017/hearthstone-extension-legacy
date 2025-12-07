import { Selector, DamageModel, DamageEvent, DamageType, SpellEffectModel, RoleModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('mortal-strike-effect')
export class MortalStrikeEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: MortalStrikeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mortal Strike's effect",
                desc: "Deal *4* damage. If you have 12 or less Health, deal *6* instead.",
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

        // Check if player has 12 or less Health
        const hero = player.child.hero;
        const health = hero.child.health;
        const damageAmount = health.state.current <= 12 ? 6 : 4;

        // Deal damage to the target
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: damageAmount,
            })
        ]);
    }
}

