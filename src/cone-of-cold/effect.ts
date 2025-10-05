import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, MinionCardModel, ROLE_ROUTE, CardRoute, CARD_ROUTE, SpellEffectModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

export namespace ConeOfColdEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@StoreUtil.is('cone-of-cold-effect')
export class ConeOfColdEffectModel extends SpellEffectModel<[RoleModel],
    ConeOfColdEffectProps.E,
    ConeOfColdEffectProps.S,
    ConeOfColdEffectProps.C,
    ConeOfColdEffectProps.R
> {
    constructor(loader?: Loader<ConeOfColdEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Cone of Cold's effect",
                    desc: "Freeze a minion and the minions next to it, and deal {{state.damage[0]}} damage to them.",
                    damage: [1],
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: CARD_ROUTE,
            }
        })
    }

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true);
        return [new SelectEvent(roles, { hint: "Choose a target" })]
    }

    protected async doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;

        if (!target.route.card) return;

        const player = this.route.player;
        if (!player) return;

        // Get the board that contains the target minion
        const board = target.route.board;
        if (!board) return;
        const index = board.refer.order.indexOf(target.route.card);
        const cards = board.refer.order.slice(Math.max(0, index - 1), index + 2);
        const minions: MinionCardModel[] = [];
        cards.forEach((item) => {
            if (item instanceof MinionCardModel) minions.push(item);
        });

        // Deal 1 damage to all affected minions
        await DamageModel.run(minions.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: item.child.role,
            origin: this.state.damage[0] ?? 0,
        })));
        // Freeze all affected minions
        minions.forEach((item) => { 
            const entries = item.child.role.child.entries;
            const frozen = entries.child.frozen;
            frozen.active();
        });
    }
}
