import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, RoleModel, CostModel, LibraryUtil, TauntModel, RoleFeatsModel } from "hearthstone-core";

@LibraryUtil.is('baine-bloodhoof')
export class BaineBloodhoofModel extends MinionCardModel {
    constructor(props?: BaineBloodhoofModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Baine Bloodhoof",
                desc: "",
                flavorDesc: "",
                rarity: RarityType.LEGENDARY,
                class: ClassType.NEUTRAL,
                races: [],
                isCollectible: false,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 5 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 5 }}),
                        health: new RoleHealthModel({ state: { origin: 5 }}),
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
