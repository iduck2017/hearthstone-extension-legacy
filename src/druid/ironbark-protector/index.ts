/**
 * Ironbark Protector
 * 
 * I dare you to attack Darnassus.
 * 
 * Taunt
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Dave Allsop
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel, TauntModel } from "hearthstone-core";

@LibraryUtil.is('ironbark-protector')
export class IronbarkProtectorModel extends MinionCardModel {
    constructor(props?: IronbarkProtectorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ironbark Protector',
                desc: 'Taunt',
                isCollectible: true,
                flavorDesc: 'I dare you to attack Darnassus.',
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 8 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 8 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 8 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { 
                        taunt: new TauntModel({ state: { isActive: true } })
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}

