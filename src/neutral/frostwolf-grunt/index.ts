/*
 * Frostwolf Grunt 2/2/2
 * Grunting is what his father did and his father before that. It's more than just a job.
 * Taunt
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Richie Marella
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType, TauntModel } from "hearthstone-core";

@LibraryService.is('frostwolf-grunt')
export class FrostwolfGruntModel extends MinionCardModel {
    constructor(props?: FrostwolfGruntModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Frostwolf Grunt',
                desc: 'Taunt',
                flavorDesc: 'Grunting is what his father did and his father before that. It\'s more than just a job.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                taunt: props.child?.taunt ?? new TauntModel(),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
