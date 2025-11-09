import { Selector, RoleModel, DamageModel, DamageEvent, DamageType, MinionCardModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('cone-of-cold-effect')
export class ConeOfColdEffectModel extends SpellEffectModel<[RoleModel]> {
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

    toRun(): [Selector<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true);
        return [new Selector(roles, { hint: "Choose a target" })]
    }

    protected async doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;

        if (!target.route.card) return;

        const player = this.route.player;
        if (!player) return;

        // Get the board that contains the target minion
        const board = target.route.board;
        if (!board) return;
        const index = board.child.cards.indexOf(target.route.card);
        const cards = board.child.cards.slice(Math.max(0, index - 1), index + 2);
        const minions: MinionCardModel[] = [];
        cards.forEach((item) => {
            if (item instanceof MinionCardModel) minions.push(item);
        });

        // Deal 1 damage to all affected minions
        await DamageModel.deal(minions.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: item.child.role,
            origin: this.state.damage[0] ?? 0,
        })));
        // Freeze all affected minions
        minions.forEach((item) => { 
            const feats = item.child.role.child.feats;
            const frozen = feats.child.frozen;
            frozen.active();
        });
    }
}
