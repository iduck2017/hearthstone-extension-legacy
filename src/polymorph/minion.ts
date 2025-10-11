/**
 * Sheep
 * 
 * A 1/1 Sheep created by Polymorph.
 * 
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Collectible: No
 */
import { ClassType, RoleHealthModel, MinionCardModel, RarityType, RoleAttackModel, RoleModel, RaceType, CostModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('sheep')
export class SheepModel extends MinionCardModel {
    constructor(props?: SheepModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Sheep',
                desc: '',
                isCollectible: false,
                flavorDesc: '',
                rarity: RarityType.COMMON,
                races: [RaceType.BEAST],
                class: ClassType.MAGE,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 1 }}),
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
