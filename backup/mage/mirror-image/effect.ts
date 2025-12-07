/**
 * Mirror Image
 * 
 * Oh hey it's Mirror Image! !egamI rorriM s'ti yeh hO
 * 
 * Summon two 0/2 minions with Taunt.
 * 
 * Type: Spell
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: Jim Nelson
 * Collectible
 */

import { EffectModel, Selector, SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
import { MirrorImageMinionModel } from "./minion";


@ChunkService.is('mirror-image-effect')
export class MirrorImageEffectModel extends SpellEffectModel<never> {
    constructor(props?: MirrorImageEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Mirror Image's effect",
                desc: "Summon two 0/2 minions with Taunt.",
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
        if (!player) return;
        const board = player.child.board;
        const card = this.route.card;
        if (!card) return;
        
        // Summon two 0/2 minions with Taunt
        for (let i = 0; i < 2; i++) {
            const minion = new MirrorImageMinionModel();
            minion.summon(board);
        }
    }
} 