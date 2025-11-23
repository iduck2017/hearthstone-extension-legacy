import { TurnEndModel, MinionCardModel, BaseFeatureModel, RoleAttackBuffModel, RoleHealthBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('gruul-feature')
export class GruulFeatureModel extends TurnEndModel {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
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
                isEnabled: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    protected doRun() {
        const minion = this.route.minion;
        if (!minion) return;
        minion.buff(new BaseFeatureModel({
            state: {
                name: "Gruul's Growth",
                desc: "+1/+1",
            },
            child: {
                buffs: [
                    new RoleAttackBuffModel({ state: { offset: 1 } }),
                    new RoleHealthBuffModel({ state: { offset: 1 } })
                ]
            },
        }));
    }
}
