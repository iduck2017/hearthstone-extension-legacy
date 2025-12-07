import { EffectModel, SpellEffectModel, Selector, MinionCardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('shadow-word-pain-effect')
export class ShadowWordPainEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: ShadowWordPainEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shadow Word: Pain's effect",
                desc: "Destroy a minion with 3 or less Attack.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        
        // Only target minions with 3 or less Attack
        const roles = games.refer.minions.filter(role => role.child.attack.state.current <= 3);
        return new Selector(roles, { hint: "Choose a minion with 3 or less Attack" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        if (target.child.attack.state.current > 3) return;
        // Destroy the minion
        target.child.dispose.destroy(this.route.card, this);
    }
}
