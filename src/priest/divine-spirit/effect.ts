import { EffectModel, SpellEffectModel, Selector, RoleModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { DivineSpiritBuffModel } from "./buff";

@TemplUtil.is('divine-spirit-effect')
export class DivineSpiritEffectModel extends SpellEffectModel<[MinionCardModel]> {
    constructor(props?: DivineSpiritEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Divine Spirit's effect",
                desc: "Double a minion's Health.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [Selector<MinionCardModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        
        // Only target minions
        const roles = games.query(true);
        if (roles.length === 0) return; // No valid targets
        
        return [new Selector(roles, { hint: "Choose a minion" })];
    }

    protected async doRun(target: MinionCardModel) {
        // Get current health and create a buff with equal value
        const currentHealth = target.child.health.state.current;
        const buff = new DivineSpiritBuffModel({ state: { offset: [0, currentHealth] }});
        target.child.feats.add(buff);
    }
}
