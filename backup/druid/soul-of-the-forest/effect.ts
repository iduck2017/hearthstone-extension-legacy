import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
// TODO: Implement Deathrattle addition
// Need to add a Deathrattle to all friendly minions that summons a 2/2 Treant

@TemplUtil.is('soul-of-the-forest-effect')
export class SoulOfTheForestEffectModel extends SpellEffectModel<[]> {
    constructor(props?: SoulOfTheForestEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Soul of the Forest's effect",
                desc: "Give your minions \"Deathrattle: Summon a 2/2 Treant.\"",
                damage: [],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        
        // Get all friendly minions
        const minions = player.query(true);
        
        // TODO: Add Deathrattle to all friendly minions
        // Need to create a Deathrattle that summons a 2/2 Treant
        // Need to implement Treant minion first
        for (const minion of minions) {
            // minion.child.feats.add(new SoulOfTheForestDeathrattleModel());
        }
    }
}

