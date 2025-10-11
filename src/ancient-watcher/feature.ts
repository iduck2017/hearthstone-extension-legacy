import { FeatureModel, RoleActionDecor, RoleActionModel, RoleModel } from "hearthstone-core";
import { StateUtil, TemplUtil, Decor } from "set-piece";

@TemplUtil.is('ancient-watcher-feature')
export class AncientWatcherFeatureModel extends FeatureModel {
    public get route() {
        const result = super.route;
        const role: RoleModel | undefined = result.list.find(item => item instanceof RoleModel);
        return {
            ...result,
            role
        };
    }

    constructor(props?: AncientWatcherFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                isBoard: true,
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
    @StateUtil.on(self => self.modifyAction)
    private listenAction() {
        return this.route.role?.proxy.child.action.decor
    }
    private modifyAction(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.isActive) return;
        decor.lock()
    }
} 