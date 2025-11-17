import { Selector, RoleModel, RestoreModel, RestoreEvent, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('healing-touch-effect')
export class HealingTouchEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: HealingTouchEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Healing Touch's effect",
                desc: "Restore 8 Health.",
                damage: [],
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
        
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target,
                origin: 8,
            })
        ]);
    }
}

