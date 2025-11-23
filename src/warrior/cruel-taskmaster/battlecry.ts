import { BattlecryModel, MinionCardModel, DamageModel, DamageEvent, DamageType, BaseFeatureModel, RoleAttackBuffModel, Selector } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('cruel-taskmaster-battlecry')
export class CruelTaskmasterBattlecryModel extends BattlecryModel<MinionCardModel> {
    constructor(props?: CruelTaskmasterBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Cruel Taskmaster's Battlecry",
                desc: "Deal 1 damage to a minion and give it +2 Attack.",
                ...props.state,
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
        const minion = this.route.minion;
        if (!minion) return;

        // Deal 1 damage to the target minion
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.DEFEND,
                source: minion,
                method: this,
                target,
                origin: 1,
            })
        ]);

        // Give the minion +2 Attack buff
        target.buff(new BaseFeatureModel({
            state: {
                name: "Cruel Taskmaster's Buff",
                desc: "+2 Attack.",
            },
            child: {
                buffs: [new RoleAttackBuffModel({ state: { offset: 2 } })]
            },
        }));
    }
}

