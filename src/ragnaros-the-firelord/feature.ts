import { FeatureModel, ROLE_ROUTE, RoleActionDecor, RoleActionModel, RoleRoute } from "hearthstone-core";
import { StateUtil, TemplUtil, Loader } from "set-piece";

export namespace RagnarosFeatureProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = RoleRoute;
}

@TemplUtil.is('ragnaros-feature')
export class RagnarosFeatureModel extends FeatureModel<
    RagnarosFeatureProps.E,
    RagnarosFeatureProps.S,
    RagnarosFeatureProps.C,
    RagnarosFeatureProps.R,
    RagnarosFeatureProps.P
> {
    constructor(loader?: Loader<RagnarosFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Ragnaros\'s Restriction',
                    desc: 'Can\'t attack.',
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: ROLE_ROUTE,
            }
        });
    }

    // Disable attack action
    @StateUtil.on(self => self.route.role?.proxy.child.action.decor)
    private onCheck(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.isActive) return;
        decor.lock()
    }
    
}
