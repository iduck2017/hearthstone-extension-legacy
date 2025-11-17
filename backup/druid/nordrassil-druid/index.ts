/**
 * Nordrassil Druid
 * 
 * The World Tree Nordrassil provides life-giving energy to the world--and excellent mana savings.
 * 
 * Battlecry: The next spell you cast this turn costs (3) less.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Druid
 * Artist: Dave Greco
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { NordrassilDruidBattlecryModel } from "./battlecry";

@LibraryUtil.is('nordrassil-druid')
export class NordrassilDruidModel extends MinionCardModel {
    constructor(props?: NordrassilDruidModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Nordrassil Druid',
                desc: 'Battlecry: The next spell you cast this turn costs (3) less.',
                isCollectible: true,
                flavorDesc: 'The World Tree Nordrassil provides life-giving energy to the world--and excellent mana savings.',
                rarity: RarityType.RARE,
                class: ClassType.DRUID,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { battlecry: [new NordrassilDruidBattlecryModel()] }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}

