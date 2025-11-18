/*
 * Ancient Watcher
 * Why do its eyes seem to follow you as you walk by?
 * Can't attack.
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Richard Wright
 * Collectible
 */

import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RarityType, LibraryUtil, CostModel } from "hearthstone-core";
import { AncientWatcherFeatureModel } from "./feature";

@LibraryUtil.is('ancient-watcher')  
export class AncientWatcherModel extends MinionCardModel {
    constructor(props?: AncientWatcherModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ancient Watcher',
                desc: 'Can\'t attack.',
                collectible: true,
                flavorDesc: 'Why do its eyes seem to follow you as you walk by?',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? [new AncientWatcherFeatureModel()],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 