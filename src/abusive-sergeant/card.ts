import { MinionCardModel, FeatureModel } from "hearthstone-core";
import { AbusiveSergeantRoleModel } from "./role";
import { AbusiveSergeantBattlecryModel } from "./battlecry";

export class AbusiveSergeantCardModel extends MinionCardModel {
    constructor(props: AbusiveSergeantCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant',
                desc: 'Battlecry: Give a minion +2 Attack this turn.',
                mana: 1,
                ...props.state,
            },
            child: {
                role: new AbusiveSergeantRoleModel({}),
                ...props.child,
                battlecries: FeatureModel.assign(
                    props.child?.battlecries, 
                    new AbusiveSergeantBattlecryModel({})
                ),
            },
            refer: { ...props.refer },
        });
    }
}