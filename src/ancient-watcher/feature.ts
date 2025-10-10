import { FeatureModel, RoleActionDecor, RoleActionModel } from "hearthstone-core";
import { StateUtil, TemplUtil, Decor } from "set-piece";

export namespace AncientWatcherFeatureProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {}
}

@TemplUtil.is('ancient-watcher-feature')
export class AncientWatcherFeatureModel extends FeatureModel<
    AncientWatcherFeatureProps.E,
    AncientWatcherFeatureProps.S,
    AncientWatcherFeatureProps.C,
    AncientWatcherFeatureProps.R
> {
    constructor(props?: AncientWatcherFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ancient Watcher\'s Restriction',
                desc: 'Can\'t attack.',
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // Disable attack action
    @StateUtil.on(self => self.route.role?.proxy.child.action.decor)
    private onCheck(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.isActive) return;
        decor.lock()
    }
} 