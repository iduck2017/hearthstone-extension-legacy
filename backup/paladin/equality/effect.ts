import { SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('equality-effect')
export class EqualityEffectModel extends SpellEffectModel<[]> {
    constructor(props?: EqualityEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Equality's effect",
                desc: "Change the Health of ALL minions to 1.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        const game = this.route.game;
        if (!game) return;

        const minions = game.query(true);
        for (const minion of minions) {
            // TODO: Set health to 1
            // This requires directly setting the health value, which may need a different approach
            const currentHealth = minion.child.health.state.current;
            if (currentHealth > 1) {
                // We need to reduce health to 1
                // This is a complex operation that may require damage or direct health modification
                // For now, we'll add a TODO comment
            }
        }
    }
}

