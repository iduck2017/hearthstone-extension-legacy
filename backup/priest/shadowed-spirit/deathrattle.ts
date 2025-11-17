import { DamageEvent, DamageModel, DamageType, DeathrattleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('shadowed-spirit-deathrattle')
export class ShadowedSpiritDeathrattleModel extends DeathrattleModel {
    constructor(props?: ShadowedSpiritDeathrattleModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Shadowed Spirit\'s Deathrattle',
                desc: 'Deal 3 damage to the enemy hero.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public run() {
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
                origin: 3,
                type: DamageType.DEFAULT,
            }),
        ]);
    }
}
