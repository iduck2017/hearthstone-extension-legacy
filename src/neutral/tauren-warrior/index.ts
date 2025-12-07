/*
 * Tauren Warrior 3/2/3
 * Tauren Warrior: Champion of Mulgore, Slayer of Quilboar, Rider of Thunderbluff Elevators.
 * Taunt Has +3 Attack while damaged.
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Paul Warzecha
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType, TauntModel } from "hearthstone-core";
import { TaurenWarriorFeatureModel } from "./feature";

@LibraryService.is('tauren-warrior')
export class TaurenWarriorModel extends MinionCardModel {
    constructor(props?: TaurenWarriorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Tauren Warrior',
                desc: 'Taunt Has +3 Attack while damaged.',
                flavorDesc: 'Tauren Warrior: Champion of Mulgore, Slayer of Quilboar, Rider of Thunderbluff Elevators.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                taunt: props.child?.taunt ?? new TauntModel(),
                feats: props.child?.feats ?? [new TaurenWarriorFeatureModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
