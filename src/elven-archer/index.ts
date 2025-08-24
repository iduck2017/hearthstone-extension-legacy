import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel } from "hearthstone-core";
import { ElvenArcherBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('elven-archer')
export class ElvenArcherModel extends CardModel {
    constructor(props: ElvenArcherModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Elven Archer',
                desc: 'Battlecry: Deal 1 damage.',
                flavorDesc: 'Don\'t bother asking her out on a date. She\'ll shoot you down.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}),   
                    }
                }),
                hooks: new CardHooksModel({
                    child: { battlecry: [
                        new ElvenArcherBattlecryModel({})
                    ]}
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}