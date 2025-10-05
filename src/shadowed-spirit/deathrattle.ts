import { DamageEvent, DamageModel, DamageType, DeathrattleModel, ROLE_ROUTE, RoleRoute } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

export namespace ShadowedSpiritDeathrattleProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = RoleRoute
}

@StoreUtil.is('shadowed-spirit-deathrattle')
export class ShadowedSpiritDeathrattleModel extends DeathrattleModel<
    ShadowedSpiritDeathrattleProps.E,
    ShadowedSpiritDeathrattleProps.S,
    ShadowedSpiritDeathrattleProps.C,
    ShadowedSpiritDeathrattleProps.R,
    ShadowedSpiritDeathrattleProps.P
> {
    constructor(loader?: Loader<ShadowedSpiritDeathrattleModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Shadowed Spirit\'s Deathrattle',
                    desc: 'Deal 3 damage to the enemy hero.',
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
                origin: 3,
                type: DamageType.DEFAULT,
            }),
        ]);
    }
}
