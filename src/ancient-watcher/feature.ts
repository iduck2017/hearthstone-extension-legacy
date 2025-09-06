import { ActionModel, ActionProps, FeatureModel } from "hearthstone-core";
import { StateUtil, StoreUtil, Loader, Decor } from "set-piece";
import { DeepReadonly } from "utility-types";



@StoreUtil.is('ancient-watcher-feature')
export class AncientWatcherFeatureModel extends FeatureModel {
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
            }
        });
    }

    // Disable attack action
    @StateUtil.on(self => self.route.role?.proxy.child.action.decor)
    private onCheck(
        that: ActionModel, 
        decor: Decor<ActionProps.S>
    ) {
        if (!this.state.isActive) return;
        decor.current.isEnable = false;
    }
} 