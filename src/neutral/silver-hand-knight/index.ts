/*
 * Silver Hand Knight 5/4/4
 * It's good to be a knight. Less so to be one's squire.
 * Battlecry: Summon a 2/2 Squire.
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Matt Starbuck
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { SilverHandKnightBattlecryModel } from "./battlecry";

@LibraryService.is('silver-hand-knight')
export class SilverHandKnightModel extends MinionCardModel {
    constructor(props?: SilverHandKnightModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Silver Hand Knight',
                desc: 'Battlecry: Summon a 2/2 Squire.',
                flavorDesc: 'It\'s good to be a knight. Less so to be one\'s squire.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 5 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 4 }}),
                battlecry: props.child?.battlecry ?? [new SilverHandKnightBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
