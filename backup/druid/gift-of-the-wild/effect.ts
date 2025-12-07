import { EffectModel, SpellEffectModel, TauntModel, RoleBuffModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('gift-of-the-wild-effect')
export class GiftOfTheWildEffectModel extends SpellEffectModel<[]> {
    constructor(props?: GiftOfTheWildEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Gift of the Wild's effect",
                desc: "Give your minions +2/+2 and Taunt.",
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
        
        // Give +2/+2 and Taunt to all friendly minions
        for (const minion of minions) {
            // Add +2/+2 buff
            const buff = new RoleBuffModel({
                state: {
                    name: "Gift of the Wild's Buff",
                    desc: "+2/+2.",
                    offset: [2, 2] // +2 Attack, +2 Health
                }
            });
            minion.child.feats.add(buff);
            
            // Give Taunt
            const taunt = minion.child.feats.child.taunt;
            if (!taunt) {
                minion.child.feats.add(new TauntModel({ state: { isActive: true } }));
            } else {
                taunt.active();
            }
        }
    }
}

