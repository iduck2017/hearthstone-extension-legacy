import { MinionCardModel, RoleHealthModel, RoleAttackModel, LibraryService, CostModel, ClassType, RarityType } from "hearthstone-core";
import { ElvenArcherMinionBattlecryModel } from "./battlecry";

@LibraryService.is('elven-archer')
export class ElvenArcherModel extends MinionCardModel {
    constructor(props?: ElvenArcherModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Elven Archer',
                desc: 'Battlecry: Deal 1 damage.',
                isCollectible: true,
                flavorDesc: 'Don\'t bother asking her out on a date. She\'ll shoot you down.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                battlecry: props.child?.battlecry ?? [new ElvenArcherMinionBattlecryModel()],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}