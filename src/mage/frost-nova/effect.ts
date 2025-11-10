import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('frost-nova-effect')
export class FrostNovaEffectModel extends SpellEffectModel<[]>{
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

    toRun(): [] { return [] }

    protected async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;

        // Get all enemy minions
        const roles = opponent.query(true);
        
        // Freeze all enemy minions
        for (const role of roles) {
            const feats = role.child.feats;
            const frozen = feats.child.frozen;
            frozen.active();
        }
    }
}
