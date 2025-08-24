import { AttackModel, CardHooksModel, CardModel, ClassType, HealthModel, MinionModel, RarityType, RoleModel } from "hearthstone-core";
import { LeperGnomeDeathrattleModel } from "./deathrattle";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('leper-gnome')
export class LeperGnomeModel extends CardModel {
    constructor(props: LeperGnomeModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Leper Gnome',
                desc: 'Deathrattle: Deal 2 damage to the enemy hero.',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        health: new HealthModel({ state: { origin: 1 }}),
                        attack: new AttackModel({ state: { origin: 2 }}),
                    },
                }),
                hooks: new CardHooksModel({
                    child: { deathrattle: [new LeperGnomeDeathrattleModel({})] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}