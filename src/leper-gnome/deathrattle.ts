import { DamageModel, DamageType, DeathrattleModel } from "hearthstone-core";

export class LeperGnomeDeathrattleModel extends DeathrattleModel {
    constructor(props: LeperGnomeDeathrattleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Leper Gnome\'s Deathrattle',
                desc: 'Deal 2 damage to the enemy hero.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public async doRun() {
        const player = this.route.player;
        const card = this.route.card;
        if (!card) return;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        DamageModel.deal([{
            source: card.child.damage,
            target: opponent.child.hero.child.role,
            damage: 2,
            result: 2,
            type: DamageType.DEFAULT,
        }]);
    }
}