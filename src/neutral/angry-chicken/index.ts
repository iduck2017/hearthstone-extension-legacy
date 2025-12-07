/*
 * Angry Chicken
 * There is no beast more frightening (or ridiculous) than a fully enraged chicken.
 * +5 Attack while damaged.
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Artist: Ben Thompson
 * Collectible
 */

import { RoleAttackModel, ClassType, MinionCardModel, RaceType, RarityType, LibraryService, CostModel, RoleHealthModel } from "hearthstone-core";
import { AngryChickenFeatureModel } from "./feature";

@LibraryService.is('angry-chicken')
export class AngryChickenModel extends MinionCardModel {
    constructor(props?: AngryChickenModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Angry Chicken',
                desc: '+5 Attack while damaged.',
                isCollectible: true,
                flavorDesc: 'There is no beast more frightening (or ridiculous) than a fully enraged chicken.',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? [new AngryChickenFeatureModel()],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}
