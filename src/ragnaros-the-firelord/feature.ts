import { FeatureModel, RoleActionDecor, RoleActionModel } from "hearthstone-core";
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
    @StateUtil.on(self => self.route.role?.proxy.child.action.decor)
    private onCheck(that: RoleActionModel, decor: RoleActionDecor) {
        if (!this.state.isActive) return;
        decor.lock()
    }
    
}
