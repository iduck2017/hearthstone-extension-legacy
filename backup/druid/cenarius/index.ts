/**
 * Cenarius
 * 
 * Yes, he's a demigod. No, he doesn't need to wear a shirt.
 * 
 * Choose One - Give your other minions +2/+2; or Summon two 2/2 Treants with Taunt.
 * 
 * Type: Minion
 * Rarity: Legendary
 * Set: Legacy
 * Class: Druid
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { CenariusBattlecryModel } from "./battlecry";

@LibraryUtil.is('cenarius')
export class CenariusModel extends MinionCardModel {
    constructor(props?: CenariusModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Cenarius',
                desc: 'Choose One - Give your other minions +2/+2; or Summon two 2/2 Treants with Taunt.',
                isCollectible: true,
                flavorDesc: 'Yes, he\'s a demigod. No, he doesn\'t need to wear a shirt.',
                rarity: RarityType.LEGENDARY,
                class: ClassType.DRUID,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 8 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 8 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { battlecry: [new CenariusBattlecryModel()] }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}

