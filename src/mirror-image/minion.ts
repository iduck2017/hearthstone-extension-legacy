/**
 * Mirror Image Minion
 * 
 * A 0/2 minion with Taunt created by Mirror Image spell.
 * 
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Collectible: No
 */

import { ClassType, RoleHealthModel, MinionCardModel, MinionFeaturesModel, RarityType, RoleAttackModel, TauntModel, CostModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('mirror-image-minion')
export class MirrorImageMinionModel extends MinionCardModel {
    constructor(props?: MirrorImageMinionModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Mirror Image',
                desc: 'Taunt',
                flavorDesc: '',
                isCollectible: false,
                rarity: RarityType.COMMON,
                races: [],
                class: ClassType.MAGE,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 0 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 0 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        taunt: new TauntModel(),
                        battlecry: []
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 