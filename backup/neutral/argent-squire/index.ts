import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RarityType, MinionFeaturesModel, DivineShieldModel } from "hearthstone-core";
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
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { 
                        divineShield: new DivineShieldModel({ state: { isActive: true } })
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}