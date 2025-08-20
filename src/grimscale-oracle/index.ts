import { MinionCardModel, RaceType } from "hearthstone-core";
import { GrimscaleOracleRoleModel } from "./role";

export class GrimscaleOracleCardModel extends MinionCardModel {
    constructor(props: GrimscaleOracleCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Grimscale Oracle',
                desc: 'Your other Murlocs have +1 Attack.',
                mana: 1,
                races: [RaceType.MURLOC],
                ...props.state
            },
            child: {
                role: new GrimscaleOracleRoleModel({}),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
}