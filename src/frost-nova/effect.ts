import { EffectModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('frost-nova-effect')
export class FrostNovaEffectModel extends EffectModel<[]> {
    constructor(loader?: Loader<FrostNovaEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Frost Nova's effect",
                    desc: "Freeze all enemy minions.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        })
    }

    toRun(): [] { return [] }

    protected async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;

        // Get all enemy minions
        const roles = opponent.query(true);
        
        // Freeze all enemy minions
        for (const role of roles) {
            const entries = role.child.entries;
            const frozen = entries.child.frozen;
            frozen.active();
        }
    }
}
