import { Selector, SpellEffectModel, MinionCardModel, BaseFeatureModel, RoleAttackBuffModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('blessed-champion-effect')
export class BlessedChampionEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: BlessedChampionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blessed Champion's effect",
                desc: "Double a minion's Attack.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        
        // Only target minions
        const roles = game.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        
        // Get current attack and create a buff with equal value to double it
        const attack = target.child.attack.state.current;
        target.buff(new BaseFeatureModel({
            state: {
                name: "Blessed Champion's Buff",
                desc: "Double a minion's Attack.",
            },
            child: {
                buffs: [new RoleAttackBuffModel({ state: { offset: attack } })]
            },
        }));
    }
}

