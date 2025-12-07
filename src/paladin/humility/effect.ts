import { Selector, SpellEffectModel, MinionCardModel, BaseFeatureModel, RoleAttackBuffModel, OperatorType } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('humility-effect')
export class HumilityEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: HumilityEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Humility's effect",
                desc: "Change a minion's Attack to 1.",
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

        // Change the minion's Attack to 1 using SET operator
        target.buff(new BaseFeatureModel({
            state: {
                name: "Humility's Buff",
                desc: "Attack changed to 1.",
            },
            child: {
                buffs: [new RoleAttackBuffModel({ 
                    state: { 
                        offset: 1,
                        type: OperatorType.SET
                    } 
                })]
            },
        }));
    }
}
