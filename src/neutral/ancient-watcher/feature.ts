import { FeatureModel, RoleActionDecor, RoleActionModel, RoleFeatureModel, RoleModel } from "hearthstone-core";
import { StateUtil, TemplUtil, Decor } from "set-piece";

@TemplUtil.is('ancient-watcher-feature')
export class AncientWatcherFeatureModel extends RoleFeatureModel {

    constructor(props?: AncientWatcherFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ancient Watcher\'s Restriction',
                desc: 'Can\'t attack.',
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // Disable attack action
    @StateUtil.on(self => self.modifyAction)
    private listenAction() {
        return this.route.role?.proxy.child.action.decor
    }
    private modifyAction(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.isActived) return;
        decor.disable()
    }
} 