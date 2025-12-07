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
import { ClassType, RoleHealthModel, MinionCardModel, RarityType, RoleAttackModel, RaceType, CostModel, LibraryService } from "hearthstone-core";

@LibraryService.is('sheep')
export class SheepModel extends MinionCardModel {
    constructor(props?: SheepModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Sheep',
                desc: '',
                collectible: false,
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
                feats: props.child?.feats ?? [],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
