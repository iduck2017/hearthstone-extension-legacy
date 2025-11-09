/*
Booty Bay Bodyguard
You can hire him... until someone offers him enough gold to turn on you.

Taunt

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Matt Cavotta
Collectible
*/

import { MinionCardModel, RoleHealthModel, RoleAttackModel, ClassType, RarityType, TauntModel, MinionFeaturesModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('booty-bay-bodyguard')
export class BootyBayBodyguardModel extends MinionCardModel {
    constructor(props?: BootyBayBodyguardModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Booty Bay Bodyguard',
                desc: 'Taunt',
                isCollectible: true,
                flavorDesc: 'You can hire him... until someone offers him enough gold to turn on you.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 5 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 4 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        taunt: new TauntModel()
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 