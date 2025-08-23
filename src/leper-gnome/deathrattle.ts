import { DamageEvent, DamageType, DamageUtil, DeathrattleModel } from "hearthstone-core";

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
        console.log('deathrattle', card?.name);
        if (!card) return;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const target = opponent.child.role;
        DamageUtil.run([new DamageEvent({
            source: this.child.anchor,
            target,
            origin: 2,
            type: DamageType.DEFAULT,
        })]);
    }
}