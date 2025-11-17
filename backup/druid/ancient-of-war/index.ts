/**
 * Ancient of War
 * 
 * Young Night Elves love to play "Who can get the Ancient of War to Uproot?" You lose if you get crushed to death.
 * 
 * Choose One - +5 Attack; or +5 Health and Taunt.
 * 
 * Type: Minion
 * Rarity: Epic
 * Set: Legacy
 * Class: Druid
 * Artist: Sean O'Daniels
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { AncientOfWarBattlecryModel } from "./battlecry";

@LibraryUtil.is('ancient-of-war')
export class AncientOfWarModel extends MinionCardModel {
    constructor(props?: AncientOfWarModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ancient of War',
                desc: 'Choose One - +5 Attack; or +5 Health and Taunt.',
                isCollectible: true,
                flavorDesc: 'Young Night Elves love to play "Who can get the Ancient of War to Uproot?" You lose if you get crushed to death.',
                rarity: RarityType.EPIC,
                class: ClassType.DRUID,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 7 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { battlecry: [new AncientOfWarBattlecryModel()] }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}

