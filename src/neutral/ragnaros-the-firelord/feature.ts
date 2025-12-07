import { RoleFeatureModel, RoleActionDecor, RoleActionModel } from "hearthstone-core";
import { StatePlugin, ChunkService } from "set-piece";

@ChunkService.is('ragnaros-feature')
export class RagnarosFeatureModel extends RoleFeatureModel {
    constructor(props?: RagnarosFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ragnaros\'s Restriction',
                desc: 'Can\'t attack.',
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // Disable attack action
    @StatePlugin.on(self => self.modifyAction)
    private listenAction() {
        return this.route.role?.proxy.child.action.decor
    }
    private modifyAction(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.isEnabled) return;
        decor.disable()
    }
}
