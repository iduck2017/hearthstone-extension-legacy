import { DamageEvent, DamageModel, DamageType, DeathrattleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('leper-gnome-deathrattle')
export class LeperGnomeDeathrattleModel extends DeathrattleModel {
    constructor(props?: LeperGnomeDeathrattleModel['props']) {
        props = props ?? {};
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
        const target = opponent.child.hero;
        DamageModel.deal([
            new DamageEvent({
                source: card,
                method: this,
                target,
                origin: 2,
                type: DamageType.DEFAULT,
            }),
        ]);
    }
}