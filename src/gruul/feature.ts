import { EndTurnHookModel, FeatureModel, MINION_ROUTE, MinionRoute, IRoleBuffModel, TurnModel, RoleBuffModel } from "hearthstone-core";
import { Event, EventUtil, Loader, StoreUtil } from "set-piece";

export namespace GruulFeatureProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = MinionRoute
}

@StoreUtil.is('gruul-feature')
export class GruulFeatureModel extends EndTurnHookModel<
    GruulFeatureProps.E,
    GruulFeatureProps.S,
    GruulFeatureProps.C,
    GruulFeatureProps.R,
    GruulFeatureProps.P
> {
    constructor(loader?: Loader<GruulFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Gruul's feature",
                    desc: "At the end of each turn, gain +1/+1.",
                    isActive: true,
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: MINION_ROUTE,
            }
        })
    }

    protected doRun() {
        if (!this.route.board) return;
        const minion = this.route.minion;
        if (!minion) return;
        const role = minion.child.role;
        role.child.feats.add(new RoleBuffModel(() => ({
            state: {
                name: "Gruul's Growth",
                desc: "+1/+1",
                offset: [1, 1]
            }
        })));
    }
}
