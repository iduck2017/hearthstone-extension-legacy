import { Selector, RoleModel, DamageModel, DamageEvent, DamageType, MinionCardModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('cone-of-cold-effect')
export class ConeOfColdEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: ConeOfColdEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Cone of Cold's effect",
                desc: "Freeze a minion and the minions next to it, and deal {{spellDamage[0]}} damage to them.",
                damage: [1],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    prepare(): Selector<MinionCardModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles.filter(role => role instanceof MinionCardModel);
        return new Selector(roles, { hint: "Choose a target" })
    }

    protected run(params: MinionCardModel[]) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;

        const player = this.route.player;
        if (!player) return;

        // Get the board that contains the target minion
        const board = target.route.board;
        if (!board) return;
        const index = board.child.cards.indexOf(target);
        const cards = board.child.cards.slice(Math.max(0, index - 1), index + 2);
        const minions: MinionCardModel[] = [];
        cards.forEach((item) => {
            if (item instanceof MinionCardModel) minions.push(item);
        });

        // Deal 1 damage to all affected minions
        DamageModel.deal(minions.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: item,
            origin: this.state.damage[0] ?? 0,
        })));
        // Freeze all affected minions
        minions.forEach((item) => { 
            const frozen = item.child.frozen;
            frozen.active();
        });
    }
}
