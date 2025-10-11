/*
 * Stranglethorn Tiger 5/5/5
 * The wonderful thing about tigers is tigers are wonderful things!
 * Stealth
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, StealthModel, RoleFeatsModel } from "hearthstone-core";

@LibraryUtil.is('stranglethorn-tiger')
export class StranglethornTigerModel extends MinionCardModel {
    constructor(props?: StranglethornTigerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Stranglethorn Tiger',
                desc: 'Stealth',
                flavorDesc: 'The wonderful thing about tigers is tigers are wonderful things!',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 5 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 5 }}),
                        health: new RoleHealthModel({ state: { origin: 5 }}),
                        feats: new RoleFeatsModel({
                            child: { stealth: new StealthModel() }
                        })
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
