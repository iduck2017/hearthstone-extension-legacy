/*
 * Reckless Rocketeer
 * One Insane Rocketeer. One Rocket full of Explosives. Infinite Fun.
 * Charge
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: John Polidora
 * Collectible
 */

import { ChargeModel, RoleHealthModel, RoleAttackModel, MinionCardModel, ClassType, RarityType, CostModel, LibraryService } from "hearthstone-core";

@LibraryService.is('reckless-rocketeer')
export class RecklessRocketeerModel extends MinionCardModel {
    constructor(props?: RecklessRocketeerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Reckless Rocketeer',
                desc: 'Charge',
                isCollectible: true,
                flavorDesc: 'One Insane Rocketeer. One Rocket full of Explosives. Infinite Fun.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 6 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                charge: props.child?.charge ?? new ChargeModel({ state: { isEnabled: true } }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
