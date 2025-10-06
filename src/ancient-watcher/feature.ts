import { FeatureModel, ROLE_ROUTE, RoleActionDecor, RoleActionModel, RoleActionProps, RoleRoute } from "hearthstone-core";
import { StateUtil, StoreUtil, Loader, Decor } from "set-piece";

export namespace AncientWatcherFeatureProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {}
    export type P = RoleRoute
}

@StoreUtil.is('ancient-watcher-feature')
export class AncientWatcherFeatureModel extends FeatureModel<
    AncientWatcherFeatureProps.E,
    AncientWatcherFeatureProps.S,
    AncientWatcherFeatureProps.C,
    AncientWatcherFeatureProps.R,
    AncientWatcherFeatureProps.P
> {
    constructor(loader?: Loader<AncientWatcherFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Ancient Watcher\'s Restriction',
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
        console.log('onCheck', this.state.isActive);
        if (!this.state.isActive) return;
        decor.lock()
    }
} 