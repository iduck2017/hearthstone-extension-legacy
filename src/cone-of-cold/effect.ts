import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, MinionCardModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('cone-of-cold-effect')
export class ConeOfColdEffectModel extends EffectModel<[RoleModel]> {
    constructor(loader?: Loader<ConeOfColdEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Cone of Cold's effect",
                    desc: "Freeze a minion and the minions next to it, and deal 1 damage to them.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        })
    }

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true);
        return [new SelectEvent(roles, { hint: "Choose a target" })]
    }

    protected async doRun(target: RoleModel) {
        console.log("Cone of Cold effect run");
        const card = this.route.card;
        if (!card) return;

        if (!target.route.card) return;

        const player = this.route.player;
        if (!player) return;

        // Get the board that contains the target minion
        const board = target.route.board;
        if (!board) return;
        const index = board.refer.order.indexOf(target.route.card);
        const cards = board.refer.order.slice(Math.max(0, index - 1), index + 2);
        const minions: MinionCardModel[] = [];
        cards.forEach((item) => {
            if (item instanceof MinionCardModel) minions.push(item);
        });

        // Deal 1 damage to all affected minions
        await DamageModel.run(minions.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: item.child.role,
            origin: 1,
        })));
        // Freeze all affected minions
        minions.forEach((item) => { 
            const entries = item.child.role.child.entries;
            const frozen = entries.child.frozen;
            frozen.active();
        });
    }
}
