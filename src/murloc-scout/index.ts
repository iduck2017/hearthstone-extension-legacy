// Murloc Scout - 1/1 Murloc summoned by Murloc Tidehunter
// Type: Minion, Minion Type: Murloc

import { AttackModel, CardModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('murloc-scout')
export class MurlocScoutModel extends CardModel {
    constructor(props: MurlocScoutModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Scout',
                desc: '',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.MURLOC] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 