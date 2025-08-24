// Murloc Tidehunter - Battlecry: Summon a 1/1 Murloc Scout
// Type: Minion, Minion Type: Murloc, Rarity: Free, Set: Legacy, Class: Neutral

import { AttackModel, CardHooksModel, CardModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { MurlocTidehunterBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('murloc-tidehunter')
export class MurlocTidehunterModel extends CardModel {
    constructor(props: MurlocTidehunterModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Tidehunter',
                desc: 'Battlecry: Summon a 1/1 Murloc Scout.',
                isCollectible: true,
                flavorDesc: '"Death will rise, from the tides!"',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.MURLOC] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                    }
                }),
                hooks: new CardHooksModel({
                    child: {
                        battlecry: [new MurlocTidehunterBattlecryModel({})]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
