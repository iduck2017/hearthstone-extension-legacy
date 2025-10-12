import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RarityType, RoleFeaturesModel, RoleModel, DivineShieldModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('argent-squire')
export class ArgentSquireModel extends MinionCardModel {
    constructor(props?: ArgentSquireModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Argent Squire',
                desc: 'Divine Shield',
                isCollectible: true,
                flavorDesc: '"I solemnly swear to uphold the Light, purge the world of darkness, and to eat only burritos." - The Argent Dawn Oath',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 1 }}),   
                        feats: new RoleFeaturesModel({
                            child: { 
                                divineShield: new DivineShieldModel({ state: { isActive: true } })
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