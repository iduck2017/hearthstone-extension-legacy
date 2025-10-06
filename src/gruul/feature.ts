import { EndTurnHookModel, FeatureModel, MINION_ROUTE, MinionRoute, RoleBuffModel, TurnModel } from "hearthstone-core";
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

    protected doRun(isCurrent: boolean) {
        if (!isCurrent) return;
        const minion = this.route.minion;
        if (!minion) return;
        const role = minion.child.role;
        // role.child.feats.add(new GruulBuffModel());
    }
}
