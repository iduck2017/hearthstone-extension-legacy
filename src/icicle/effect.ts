import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('icicle-effect')
export class IcicleEffectModel extends EffectModel<[RoleModel]> {
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
                refer: { ...props.refer } 
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
                detail: this,
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
