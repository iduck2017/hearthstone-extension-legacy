import { AttackModel, CardModel, ClassType, DivineSheildModel, HealthModel, MinionModel, RarityType, RoleEntriesModel, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('argent-squire')
export class ArgentSquireModel extends CardModel {
    public constructor(props: CardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Argent Squire',
                desc: 'Divine Shield',
                isCollectible: true,
                flavorDesc: '"I solemnly swear to uphold the Light, purge the world of darkness, and to eat only burritos." - The Argent Dawn Oath',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}),   
                        entries: new RoleEntriesModel({ 
                            child: { 
                                divineShield: new DivineSheildModel({})
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