import { Selector, SpellEffectModel, MinionCardModel, DamageModel, DamageEvent, DamageType, BaseFeatureModel, RoleAttackBuffModel, RoleHealthBuffModel, RaceType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('demonfire-effect')
export class DemonfireEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: DemonfireEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Demonfire's effect",
                desc: "Deal 2 damage to a minion. If it's a friendly Demon, give it +2/+2 instead.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;
        const player = this.route.player;
        if (!player) return;

        // Check if it's a friendly Demon
        const isFriendly = target.route.player === player;
        const isDemon = target.state.races.includes(RaceType.DEMON);

        if (isFriendly && isDemon) {
            // Give it +2/+2 instead
            target.buff(new BaseFeatureModel({
                state: {
                    name: "Demonfire's Buff",
                    desc: "+2/+2.",
                },
                child: {
                    buffs: [
                        new RoleAttackBuffModel({ state: { offset: 2 } }),
                        new RoleHealthBuffModel({ state: { offset: 2 } })
                    ]
                },
            }));
        } else {
            // Deal 2 damage to the minion
            DamageModel.deal([
                new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    method: this,
                    target,
                    origin: 2,
                })
            ]);
        }
    }
}

