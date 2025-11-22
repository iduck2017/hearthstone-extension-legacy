
/**
 * Murloc Tidehunter
 * 
 * "Death will rise, from the tides!"
 * 
 * Battlecry: Summon a 1/1 Murloc Scout.
 * 
 * Type: Minion
 * Minion Type: Murloc
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Dan Scott
 * Collectible
 */

import { ClassType, RoleHealthModel, MinionCardModel, RaceType, RarityType, RoleAttackModel, CostModel, LibraryUtil } from "hearthstone-core";
import { MurlocTidehunterBattlecryModel } from "./battlecry";

@LibraryUtil.is('murloc-tidehunter')
export class MurlocTidehunterModel extends MinionCardModel {
    constructor(props?: MurlocTidehunterModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Tidehunter',
                desc: 'Battlecry: Summon a 1/1 Murloc Scout.',
                isCollectible: true,
                flavorDesc: '"Death will rise, from the tides!"',
                rarity: RarityType.COMMON,
                races: [RaceType.MURLOC],
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                battlecry: props.child?.battlecry ?? [new MurlocTidehunterBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
