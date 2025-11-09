import { EffectModel, Selector, RoleModel, MinionCardModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { SheepModel } from "./minion";

@TemplUtil.is('polymorph-effect')
export class PolymorphEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: PolymorphEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Polymorph's effect",
                desc: "Transform a minion into a 1/1 Sheep.",
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
        const roles = games.query(true); // Only minions can be targeted
        return [new Selector(roles, { hint: "Choose a minion" })]
    }

    protected async doRun(target: RoleModel) {
        // Get the minion card from the target role
        const minion = target.route.minion;
        if (!minion) return;
        
        // Transform the minion into a Sheep
        const sheep = new SheepModel();
        minion.transform(sheep);
    }
}
