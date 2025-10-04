import { EffectModel, RestoreEvent, RestoreModel, SpellEffectModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('circle-of-healing-effect')
export class CircleOfHealingEffectModel extends SpellEffectModel<[]> {
    constructor(loader?: Loader<CircleOfHealingEffectModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Circle of Healing's effect",
                    desc: "Restore 4 Health to ALL minions.",
                    damage: [],
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    toRun(): [] | undefined {
        // No target selection needed - affects all minions
        return [];
    }

    protected async doRun() {
        const game = this.route.game;
        if (!game) return;
        const card = this.route.card;
        if (!card) return;

        const minions = game.query(true); // Get all minions (both friendly and enemy)
        // Restore 4 Health to all minions
        await RestoreModel.run(minions.map((item) => new RestoreEvent({
            source: card,
            method: this,
            target: item,
            origin: 4,
        })));
    }
}
