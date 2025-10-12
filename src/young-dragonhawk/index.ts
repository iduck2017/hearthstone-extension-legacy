import { LibraryUtil, WindfuryModel, RaceType, RoleModel, ClassType, RarityType, CostModel, MinionCardModel, RoleHealthModel, RoleAttackModel, RoleFeaturesModel } from "hearthstone-core";

@LibraryUtil.is('young-dragonhawk')
export class YoungDragonhawkModel extends MinionCardModel {
    constructor(props?: YoungDragonhawkModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Young Dragonhawk',
                desc: 'Windfury',
                isCollectible: true,
                flavorDesc: 'They were the inspiration for the championship Taurenball team: The Dragonhawks.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 1 }}),
                        feats: new RoleFeaturesModel({
                            child: { windfury: new WindfuryModel() }
                        })
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
}