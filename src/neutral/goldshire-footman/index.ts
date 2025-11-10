/*
 * Goldshire Footman
 * If 1/2 minions are all that is defending Goldshire, you would think it would have been overrun years ago.
 * 
 * Taunt
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */
import { MinionCardModel, RoleHealthModel, RoleAttackModel, MinionFeaturesModel, TauntModel, LibraryUtil, CostModel } from "hearthstone-core";
import { ClassType, RarityType } from "hearthstone-core";

@LibraryUtil.is('goldshire-footman')
export class GoldshireFootmanModel extends MinionCardModel {
    constructor(props?: GoldshireFootmanModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Goldshire Footman',
                desc: 'Taunt',
                isCollectible: true,
                flavorDesc: 'If 1/2 minions are all that is defending Goldshire, you would think it would have been overrun years ago.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { taunt: new TauntModel() }
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
}