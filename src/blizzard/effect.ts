import { EffectModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('blizzard-effect')
export class BlizzardEffectModel extends EffectModel<[]> {
    constructor(loader?: Loader<BlizzardEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Blizzard's effect",
                    desc: "Deal 2 damage to all enemy minions and Freeze them.",
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
        const card = this.route.card;
        if (!card) return;

        // Get all enemy minions
        const roles = opponent.query(true);
        
        // Deal 2 damage to all enemy minions
        await DamageModel.run(roles.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: item,
            origin: 2,
        })));
        // Freeze all enemy minions
        for (const role of roles) {
            const entries = role.child.entries;
            const frozen = entries.child.frozen;
            frozen.active();
        }
    }
}
