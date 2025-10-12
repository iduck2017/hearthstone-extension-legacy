import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, RoleModel, RoleFeaturesModel, TauntModel, CostModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('gnoll')
export class GnollModel extends MinionCardModel {
    constructor(props?: GnollModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Gnoll",
                desc: "Taunt",
                flavorDesc: "",
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                isCollectible: false,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 2 }}),
                        feats: new RoleFeaturesModel({
                            child: {
                                taunt: new TauntModel()
                            }
                        })
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
