/*
 * Sen'jin Shieldmasta 4/3/5
 * Sen'jin Village is nice, if you like trolls and dust.
 * Taunt
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Brian Despain
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType, TauntModel } from "hearthstone-core";

@LibraryService.is('senjin-shieldmasta')
export class SenjinShieldmastaModel extends MinionCardModel {
    constructor(props?: SenjinShieldmastaModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Sen\'jin Shieldmasta',
                desc: 'Taunt',
                flavorDesc: 'Sen\'jin Village is nice, if you like trolls and dust.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                taunt: props.child?.taunt ?? new TauntModel(),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
