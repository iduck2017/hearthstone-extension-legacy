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
import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeatsModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { MirrorImageEffectModel } from "./effect";

@LibraryUtil.is('mirror-image')
export class MirrorImageModel extends SpellCardModel {
    constructor(loader?: Loader<MirrorImageModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Mirror Image",
                    desc: "Summon two 0/2 minions with Taunt.",
                    flavorDesc: "Oh hey it's Mirror Image! !egamI rorriM s'ti yeh hO",
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.MAGE,
                    schools: [],
                    ...props.state
                },
                refer: { ...props.refer },
                child: { 
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { origin: 1 }})),
                    feats: props.child?.feats ?? new SpellFeatsModel(() => ({
                        child: { effects: [new MirrorImageEffectModel()] }
                    })),
                    ...props.child 
                }
            }
        })
    }
} 