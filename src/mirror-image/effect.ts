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

import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { MirrorImageMinionModel } from "./minion";

export namespace MirrorImageEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('mirror-image-effect')
export class MirrorImageEffectModel extends SpellEffectModel<[],
    MirrorImageEffectProps.E,
    MirrorImageEffectProps.S,
    MirrorImageEffectProps.C,
    MirrorImageEffectProps.R
> {
    constructor(loader?: Loader<MirrorImageEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Mirror Image's effect",
                    desc: "Summon two 0/2 minions with Taunt.",
                    damage: [],
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        })
    }

    toRun(): [] { return [] }

    protected async doRun() {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const card = this.route.card;
        if (!card) return;
        
        // Summon two 0/2 minions with Taunt
        for (let i = 0; i < 2; i++) {
            const minion = new MirrorImageMinionModel();
            const deploy = minion.child.deploy;
            deploy.run(board);
        }
    }
} 