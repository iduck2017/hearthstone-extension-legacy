import { ChargeModel, RoleHealthModel, RoleAttackModel, MinionCardModel, RaceType, RoleModel, RoleFeatsModel, ClassType, RarityType, CostModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('stonetusk-boar')   
export class StonetuskBoarModel extends MinionCardModel {
    constructor(props?: StonetuskBoarModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Stonetusk Boar',
                desc: 'Charge',
                isCollectible: true,
                flavorDesc: 'This card is boaring.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 1 }}),
                        feats: new RoleFeatsModel({
                            child: {
                                charge: new ChargeModel({ state: { isActive: true } })
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