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
import { ClassType, RoleHealthModel, MinionCardModel, RarityType, RoleAttackModel, RaceType, CostModel, LibraryUtil, MinionFeaturesModel } from "hearthstone-core";

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
