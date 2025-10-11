import { FeatureModel, RoleActionDecor, RoleActionModel, RoleModel } from "hearthstone-core";
import { StateUtil, TemplUtil } from "set-piece";

export namespace RagnarosFeatureProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

@TemplUtil.is('ragnaros-feature')
export class RagnarosFeatureModel extends FeatureModel<
    RagnarosFeatureProps.E,
    RagnarosFeatureProps.S,
    RagnarosFeatureProps.C,
    RagnarosFeatureProps.R
> {
    public get route() {
        const result = super.route;
        const role: RoleModel | undefined = result.list.find(item => item instanceof RoleModel);
        return {
            ...result,
            role
        };
    }

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
        return this.route.role?.proxy.child.action.decor
    }
    private modifyAction(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.isActive) return;
        decor.lock()
    }
    
}
