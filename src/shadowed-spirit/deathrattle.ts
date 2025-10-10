import { DamageEvent, DamageModel, DamageType, DeathrattleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

export namespace ShadowedSpiritDeathrattleProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('shadowed-spirit-deathrattle')
export class ShadowedSpiritDeathrattleModel extends DeathrattleModel<
    ShadowedSpiritDeathrattleProps.E,
    ShadowedSpiritDeathrattleProps.S,
    ShadowedSpiritDeathrattleProps.C,
    ShadowedSpiritDeathrattleProps.R
> {
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

    public async doRun() {
        const player = this.route.player;
        const card = this.route.card;
        if (!card) return;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const target = opponent.child.hero.child.role;
        DamageModel.run([
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
