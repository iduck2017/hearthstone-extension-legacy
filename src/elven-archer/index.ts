import { MinionCardModel, FeatureModel } from "hearthstone-core";
import { ElvenArcherRoleModel } from "./role";
import { ElvenArcherBattlecryModel } from "./battlecry";

export class ElvenArcherCardModel extends MinionCardModel {
    constructor(props: ElvenArcherCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Elven Archer',
                desc: 'Battlecry: Deal 1 damage.',
                mana: 1,
                ...props.state,
            },
            child: {
                role: new ElvenArcherRoleModel({}),
                ...props.child,
                battlecries: FeatureModel.assign(
                    props.child?.battlecries,
                    new ElvenArcherBattlecryModel({})
                ),
            },
            refer: { ...props.refer },
        });
    }
}