import { Selector, RoleModel, SpellEffectModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('hammer-of-wrath-effect')
export class HammerOfWrathEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: HammerOfWrathEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Hammer of Wrath's effect",
                desc: "Deal {{spellDamage[0]}} damage. Draw a card.",
                damage: [3],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [Selector<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query();
        return [new Selector(roles, { hint: "Choose a target" })]
    }

    protected doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 0
            })
        ]);
        
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        deck.draw();
    }
}

