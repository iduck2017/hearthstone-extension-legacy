/**
 * Blood Imp
 *
 * Imps are content to hide and viciously taunt everyone nearby.
 *
 * Stealth. At the end of your turn, give another random friendly minion +1 Health.
 *
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Bernie Kang
 * Collectible
 *
 * 1 mana 0/1
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType, StealthModel } from "hearthstone-core";
import { BloodImpFeatureModel } from "./feature";

@LibraryUtil.is('blood-imp')
export class BloodImpModel extends MinionCardModel {
    constructor(props?: BloodImpModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Blood Imp',
                desc: 'Stealth. At the end of your turn, give another random friendly minion +1 Health.',
                flavorDesc: 'Imps are content to hide and viciously taunt everyone nearby.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARLOCK,
                races: [RaceType.DEMON],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 0 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                stealth: props.child?.stealth ?? new StealthModel(),
                turnEnd: props.child?.turnEnd ?? [new BloodImpFeatureModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

