/*
Ironfur Grizzly
"Bear Carcass 1/10"

Taunt

Type: Minion
Minion Type: Beast
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Lars Grant-West
Collectible
*/

import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel, RaceType, RoleEntriesModel, TauntModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('ironfur-grizzly')
export class IronfurGrizzlyModel extends CardModel {
    constructor(props: IronfurGrizzlyModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Ironfur Grizzly',
                desc: 'Taunt',
                isCollectible: true,
                flavorDesc: 'Bear Carcass 1/10',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
                    child: {
                        attack: new AttackModel({ state: { origin: 3 }}),
                        health: new HealthModel({ state: { origin: 3 }}),   
                        entries: new RoleEntriesModel({
                            child: {
                                // Add Taunt effect
                                taunt: new TauntModel({})
                            }
                        })
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 