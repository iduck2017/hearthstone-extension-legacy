/**
 * Aldor Peacekeeper
 * 
 * The Aldor hate two things: the Scryers and smooth jazz.
 * 
 * Battlecry: Change an enemy minion's Attack to 1.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Dany Orizio
 * Collectible
 * 
 * 3 mana 3/3
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { AldorPeacekeeperBattlecryModel } from "./battlecry";

@LibraryService.is('aldor-peacekeeper')
export class AldorPeacekeeperModel extends MinionCardModel {
    constructor(props?: AldorPeacekeeperModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Aldor Peacekeeper',
                desc: 'Battlecry: Change an enemy minion\'s Attack to 1.',
                flavorDesc: 'The Aldor hate two things: the Scryers and smooth jazz.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PALADIN,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                battlecry: props.child?.battlecry ?? [new AldorPeacekeeperBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

