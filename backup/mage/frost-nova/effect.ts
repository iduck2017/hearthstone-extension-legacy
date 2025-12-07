import { EffectModel, Selector, SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";


@ChunkService.is('frost-nova-effect')
export class FrostNovaEffectModel extends SpellEffectModel<never>{
    constructor(props?: FrostNovaEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Frost Nova's effect",
                desc: "Freeze all enemy minions.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public prepare(...prev: never[]): Selector<never> | undefined {
        return undefined
    }

    protected run(params: never[]) {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;

        // Get all enemy minions
        const roles = opponent.refer.minions;
        
        // Freeze all enemy minions
        for (const role of roles) {
            const frozen = role.child.frozen;
            frozen.active();
        }
    }
}
