/*
 * Ironforge Rifleman 3/2/2
 * "Ready! Aim! Drink!"
 * Battlecry: Deal 1 damage.
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Tooth
 * Collectible
 */
import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { IronforgeRiflemanBattlecryModel } from "./battlecry";

@LibraryService.is('ironforge-rifleman')
export class IronforgeRiflemanModel extends MinionCardModel {
    constructor(props?: IronforgeRiflemanModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ironforge Rifleman',
                desc: 'Battlecry: Deal 1 damage.',
                flavorDesc: '"Ready! Aim! Drink!"',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                battlecry: props.child?.battlecry ?? [new IronforgeRiflemanBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
