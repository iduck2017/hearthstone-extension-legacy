import { DamageEvent, DamageModel, DamageType, DeathrattleModel, ROLE_ROUTE, RoleRoute } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";

export namespace LeperGnomeDeathrattleProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('leper-gnome-deathrattle')
export class LeperGnomeDeathrattleModel extends DeathrattleModel<
    LeperGnomeDeathrattleProps.E,
    LeperGnomeDeathrattleProps.S,
    LeperGnomeDeathrattleProps.C,
    LeperGnomeDeathrattleProps.R
> {
    constructor(loader?: Loader<LeperGnomeDeathrattleModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Leper Gnome\'s Deathrattle',
                    desc: 'Deal 2 damage to the enemy hero.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: ROLE_ROUTE,
            }
        });
    }

    public async doRun() {
        const player = this.route.player;
        const card = this.route.card;
        if (!card) return;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const target = opponent.child.hero.child.role;
        DamageModel.run([
            new DamageEvent({
                source: card,
                method: this,
                target,
                origin: 2,
                type: DamageType.DEFAULT,
            }),
        ]);
    }
}