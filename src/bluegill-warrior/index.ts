/*
 * Bluegill Warrior
 * He just wants a hug. A sloppy... slimy... hug.
 * Charge
 * Type: Minion
 * Minion Type: Murloc
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Jakub Kasper
 * Collectible
 * Learn More:
 * Charge
 */

import { ChargeModel, RoleHealthModel, RoleAttackModel, MinionCardModel, RaceType, RoleModel, RoleFeaturesModel, ClassType, RarityType } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('bluegill-warrior')
export class BluegillWarriorModel extends MinionCardModel {
    constructor(props?: BluegillWarriorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Bluegill Warrior',
                desc: 'Charge',
                isCollectible: true,
                flavorDesc: 'He just wants a hug. A sloppy... slimy... hug.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.MURLOC],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 1 }}),
                        feats: new RoleFeaturesModel({
                            child: {
                                charge: new ChargeModel({ state: { isActive: true } })
                            }
                        })
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 