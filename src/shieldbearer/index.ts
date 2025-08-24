import { AttackModel, CardModel, ClassType, FeaturesModel, HealthModel, MinionModel, RaceType, RarityType, RoleEntriesModel, RoleModel, TauntModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('shieldbearer')
export class ShieldbearerModel extends CardModel {
    constructor(props: ShieldbearerModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Shieldbearer',
                desc: 'Taunt',
                flavorDesc: 'Have you seen the size of the shields in this game?? This is no easy job.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.DRAENEI] },
                    child: {
                        attack: new AttackModel({ state: { origin: 0 }}),
                        health: new HealthModel({ state: { origin: 4 }}),  
                        entries: new RoleEntriesModel({
                            child: {
                                taunt: new TauntModel({})
                            }
                        })
                    },
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
} 