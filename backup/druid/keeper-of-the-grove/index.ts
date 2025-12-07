/**
 * Keeper of the Grove
 * 
 * These guys just show up and start Keeping your Groves without even asking.
 * 
 * Choose One - Deal 2 damage; or Silence a minion.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Druid
 * Artist: Gabor Szikszai
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { KeeperOfTheGroveBattlecryModel } from "./battlecry";

@LibraryService.is('keeper-of-the-grove')
export class KeeperOfTheGroveModel extends MinionCardModel {
    constructor(props?: KeeperOfTheGroveModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Keeper of the Grove',
                desc: 'Choose One - Deal 2 damage; or Silence a minion.',
                isCollectible: true,
                flavorDesc: 'These guys just show up and start Keeping your Groves without even asking.',
                rarity: RarityType.RARE,
                class: ClassType.DRUID,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 4 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { battlecry: [new KeeperOfTheGroveBattlecryModel()] }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}

