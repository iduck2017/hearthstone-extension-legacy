import { ChargeModel, RoleHealthModel, RoleAttackModel, MinionCardModel, RaceType, MinionFeaturesModel, ClassType, RarityType, CostModel, LibraryUtil } from "hearthstone-core";

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
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        charge: new ChargeModel({ state: { isActive: true } })
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}