import { EndTurnHookModel, FeatureModel, IRoleBuffModel, MinionCardModel, RoleBuffModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

export namespace GruulFeatureProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('gruul-feature')
export class GruulFeatureModel extends EndTurnHookModel<
    GruulFeatureProps.E,
    GruulFeatureProps.S,
    GruulFeatureProps.C,
    GruulFeatureProps.R
> {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.list.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion
        };
    }

    constructor(props?: GruulFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Gruul's feature",
                desc: "At the end of each turn, gain +1/+1.",
                isActive: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    protected doRun() {
        if (!this.route.board) return;
        const minion = this.route.minion;
        if (!minion) return;
        const role = minion.child.role;
        role.child.feats.add(new RoleBuffModel({
            state: {
                name: "Gruul's Growth",
                desc: "+1/+1",
                offset: [1, 1]
            }
        }));
    }
}
