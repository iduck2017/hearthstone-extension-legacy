import { MinionCardModel, RaceType } from "hearthstone-core";
import { LeperGnomeRoleModel } from "./role";
import { LeperGnomeDeathrattleModel } from "./deathrattle";

export class LeperGnomeCardModel extends MinionCardModel {
    constructor(props: LeperGnomeCardModel['props']) {
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
                role: new LeperGnomeRoleModel({}),
                deathrattle: [
                    ...props.child?.deathrattle ?? [],
                    new LeperGnomeDeathrattleModel({})
                ],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}