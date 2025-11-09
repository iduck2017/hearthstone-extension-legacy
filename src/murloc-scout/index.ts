/**
 * Murloc Scout
 * 
 * A small but brave murloc scout.
 * 
 * Type: Minion
 * Minion Type: Murloc
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Collectible: No
 */

import { ClassType, RoleHealthModel, MinionCardModel, MinionFeaturesModel, RaceType, RarityType, RoleAttackModel, CostModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('murloc-scout')
export class MurlocScoutModel extends MinionCardModel {
    constructor(props?: MurlocScoutModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Scout',
                desc: '',
                isCollectible: false,
                flavorDesc: 'A small but brave murloc scout.',
                rarity: RarityType.COMMON,
                races: [RaceType.MURLOC],
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { battlecry: [] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 