import { AttackModel, CardHooksModel, HealthModel, MinionCardModel, RoleModel } from "hearthstone-core";
import { LeperGnomeDeathrattleModel } from "./deathrattle";

export class LeperGnomeModel extends MinionCardModel {
    constructor(props: LeperGnomeModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Leper Gnome',
                desc: 'Deathrattle: Deal 2 damage to the enemy hero.',
                mana: 1,
                races: [],
                ...props.state
            },
            child: {
                role: new RoleModel({
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