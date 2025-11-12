import { EffectModel, Selector, RoleModel, MinionCardModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { SheepModel } from "./minion";

@TemplUtil.is('polymorph-effect')
export class PolymorphEffectModel extends SpellEffectModel<[MinionCardModel]> {
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

    toRun(): [Selector<MinionCardModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true); // Only minions can be targeted
        return [new Selector(roles, { hint: "Choose a minion" })]
    }

    protected doRun(target: MinionCardModel) {
        // Get the minion card from the target role
        // Transform the minion into a Sheep
        const sheep = new SheepModel();
        target.transform(sheep);
    }
}
