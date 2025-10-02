/**
 * Mirror Entity 3
 * "You go first." - Krush'gor the Behemoth, to his pet boar.
 * 
 * Secret: After your opponent plays a minion, summon a copy of it.
 * 
 * Type: Spell
 * Spell School: Arcane
 * Rarity: Common
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Raven Mimura
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SecretCardModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { MirrorEntityFeatureModel } from "./feature";

@LibraryUtil.is('mirror-entity')
export class MirrorEntityModel extends SecretCardModel {
    constructor(loader?: Loader<MirrorEntityModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Mirror Entity",
                    desc: "Secret: After your opponent plays a minion, summon a copy of it.",
                    flavorDesc: "\"You go first.\" - Krush'gor the Behemoth, to his pet boar.",
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.MAGE,
                    schools: [SchoolType.ARCANE],
                    ...props.state
                },
                refer: { ...props.refer },
                child: { 
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { origin: 3 }})),
                    feats: props.child?.feats ?? [new MirrorEntityFeatureModel()],
                    ...props.child 
                }
            }
        })
    }
}