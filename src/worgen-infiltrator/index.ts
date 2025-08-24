import { AttackModel, CardModel, ClassType, CostModel, HealthModel, MinionModel, RarityType, RoleEntriesModel, RoleModel, StealthModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('worgen-infiltrator')
export class WorgenInfiltratorModel extends CardModel {
    constructor(props: WorgenInfiltratorModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Worgen Infiltrator',
                desc: 'Stealth',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                        entries: new RoleEntriesModel({
                            child: { stealth: new StealthModel({}) }
                        })
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}