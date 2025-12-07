import { LibraryService, WindfuryModel, RaceType, ClassType, RarityType, CostModel, MinionCardModel, RoleHealthModel, RoleAttackModel } from "hearthstone-core";

@LibraryService.is('young-dragonhawk')
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
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                windfury: props.child?.windfury ?? new WindfuryModel(),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
}