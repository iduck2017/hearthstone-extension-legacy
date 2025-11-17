/**
 * Ancient of Lore
 * 
 * Go ahead, carve your initials in him.
 * 
 * Choose One - Draw 2 cards; or Restore 7 Health.
 * 
 * Type: Minion
 * Rarity: Epic
 * Set: Legacy
 * Class: Druid
 * Artist: Patrik Hjelm
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { AncientOfLoreBattlecryModel } from "./battlecry";

@LibraryUtil.is('ancient-of-lore')
export class AncientOfLoreModel extends MinionCardModel {
    constructor(props?: AncientOfLoreModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ancient of Lore',
                desc: 'Choose One - Draw 2 cards; or Restore 7 Health.',
                isCollectible: true,
                flavorDesc: 'Go ahead, carve your initials in him.',
                rarity: RarityType.EPIC,
                class: ClassType.DRUID,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 7 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 7 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 7 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { battlecry: [new AncientOfLoreBattlecryModel()] }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}

