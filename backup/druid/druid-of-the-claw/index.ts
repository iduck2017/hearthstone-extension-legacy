/**
 * Druid of the Claw
 * 
 * Cat or Bear? Cat or Bear?! I just cannot CHOOSE!
 * 
 * Choose One - Transform into a 7/6 with Rush; or a 4/9 with Taunt.
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Druid
 * Artist: Luca Zontini
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { DruidOfTheClawBattlecryModel } from "./battlecry";

@LibraryService.is('druid-of-the-claw')
export class DruidOfTheClawModel extends MinionCardModel {
    constructor(props?: DruidOfTheClawModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Druid of the Claw',
                desc: 'Choose One - Transform into a 7/6 with Rush; or a 4/9 with Taunt.',
                isCollectible: true,
                flavorDesc: 'Cat or Bear? Cat or Bear?! I just cannot CHOOSE!',
                rarity: RarityType.COMMON,
                class: ClassType.DRUID,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 6 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 6 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { battlecry: [new DruidOfTheClawBattlecryModel()] }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}

