import { EffectModel, SelectEvent, RoleModel, MinionCardModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";
import { SheepModel } from "./minion";

@StoreUtil.is('polymorph-effect')
export class PolymorphEffectModel extends EffectModel<[RoleModel]> {
    constructor(loader?: Loader<PolymorphEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Polymorph's effect",
                    desc: "Transform a minion into a 1/1 Sheep.",
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true); // Only minions can be targeted
        return [new SelectEvent(roles, { hint: "Choose a minion" })]
    }

    protected async doRun(target: RoleModel) {
        // Get the minion card from the target role
        const minion = target.route.minion;
        if (!minion) return;
        
        // Transform the minion into a Sheep
        const sheep = new SheepModel();
        minion.trans(sheep);
    }
}
