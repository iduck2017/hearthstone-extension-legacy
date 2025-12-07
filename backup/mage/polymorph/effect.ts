import { EffectModel, Selector, RoleModel, MinionCardModel, SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
import { SheepModel } from "./minion";

@ChunkService.is('polymorph-effect')
export class PolymorphEffectModel extends SpellEffectModel<MinionCardModel> {
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

    prepare(): Selector<MinionCardModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles.filter(role => role instanceof MinionCardModel);
        return new Selector(roles, { hint: "Choose a minion" })
    }

    protected run(params: MinionCardModel[]) {
        const target = params[0];
        if (!target) return;
        // Get the minion card from the target role
        // Transform the minion into a Sheep
        const sheep = new SheepModel();
        target.transform(sheep);
    }
}
