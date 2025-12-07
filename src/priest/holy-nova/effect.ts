import { EffectModel, SpellEffectModel, DamageModel, DamageEvent, RestoreModel, RestoreEvent, DamageType, Selector } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('holy-nova-effect')
export class HolyNovaEffectModel extends SpellEffectModel<never> {
    constructor(props?: HolyNovaEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Holy Nova's effect",
                desc: "Deal *2* damage to all enemy minions. Restore 2 Health to all friendly characters.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    public async doRun() {
        const game = this.route.game;
        const player = this.route.player;
        if (!game || !player) return;

        const opponent = player.refer.opponent;
        if (!opponent) return;

        const card = this.route.card;
        if (!card) return;

        // Deal 2 damage to all enemy minions
        const enemies = opponent.refer.minions;
        DamageModel.deal(enemies.map((item) => new DamageEvent({
            source: card,
            method: this,
            target: item,
                origin: 2,
                type: DamageType.SPELL,
        })));

        // Restore 2 Health to all friendly characters (hero and minions)
        const allies = player.refer.roles;
        RestoreModel.deal(allies.map((item) => new RestoreEvent({
            source: card,
            method: this,
            target: item,
            origin: 2,
        })));
    }
}
