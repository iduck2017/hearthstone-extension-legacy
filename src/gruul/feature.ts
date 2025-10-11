import { EndTurnHookModel, FeatureModel, IRoleBuffModel, MinionCardModel, RoleBuffModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";


@TemplUtil.is('gruul-feature')
export class GruulFeatureModel extends EndTurnHookModel {
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
