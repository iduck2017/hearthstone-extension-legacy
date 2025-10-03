import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, RoleRoute, ROLE_ROUTE } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

export namespace IcicleEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = RoleRoute
}

@StoreUtil.is('icicle-effect')
export class IcicleEffectModel extends EffectModel<[RoleModel],
    IcicleEffectProps.E,
    IcicleEffectProps.S,
    IcicleEffectProps.C,
    IcicleEffectProps.R,
    IcicleEffectProps.P
> {
    constructor(loader?: Loader<IcicleEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Icicle's effect",
                    desc: "Deal 2 damage to a minion. If it's Frozen, draw a card.",
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: ROLE_ROUTE,
            }
        })
    }

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true);
        return [new SelectEvent(roles, { hint: "Choose a minion" })]
    }

    protected async doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        const player = this.route.player;
        if (!player) return;
        
        // Deal 2 damage to the target
        await DamageModel.run([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 2
            })
        ])
        
        // Check if target is frozen
        const entries = target.child.entries;
        const frozen = entries.child.frozen;
        
        if (frozen.state.isActive) {
            // If frozen, draw a card
            const deck = player.child.deck;
            deck.draw();
        }
    }
}
