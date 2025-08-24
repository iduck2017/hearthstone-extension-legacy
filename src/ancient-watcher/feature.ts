import { ActionModel, FeatureModel } from "hearthstone-core";
import { StateUtil, StoreUtil } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace AncientWatcherFeatureModel {
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {}
}

@StoreUtil.is('ancient-watcher-feature')
export class AncientWatcherFeatureModel extends FeatureModel<
    AncientWatcherFeatureModel.Event,
    AncientWatcherFeatureModel.State,
    AncientWatcherFeatureModel.Child,
    AncientWatcherFeatureModel.Refer
> {
    constructor(props: AncientWatcherFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Ancient Watcher\'s Restriction',
                desc: 'Can\'t attack.',
                status: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // Disable attack action
    @StateUtil.on(self => self.route.role?.proxy.child.action.decor)
    private onCheck(
        that: ActionModel, 
        state: DeepReadonly<ActionModel.State>
    ) {
        if (!this.state.status) return state;
        const result = { ...state };
        result.status = false;
        return result;
    }
} 