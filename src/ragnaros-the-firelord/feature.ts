import { CardFeatureModel, FeatureModel, MinionFeatureModel, RoleActionDecor, RoleActionModel, RoleModel } from "hearthstone-core";
import { StateUtil, TemplUtil } from "set-piece";


@TemplUtil.is('ragnaros-feature')
export class RagnarosFeatureModel extends MinionFeatureModel {
    constructor(props?: RagnarosFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ragnaros\'s Restriction',
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
        return this.route.minion?.proxy.child.action.decor
    }
    private modifyAction(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.isActive) return;
        decor.lock()
    }
    
}
