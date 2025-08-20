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
                races: [],
                ...props.state,
            },
            child: {
                role: new ElvenArcherRoleModel({}),
                ...props.child,
                battlecryHooks: [
                    ...props.child?.battlecryHooks ?? [], 
                    new ElvenArcherBattlecryModel({})
                ]
            },
            refer: { ...props.refer },
        });
    }
}