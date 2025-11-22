import { MinionCardModel, RoleHealthModel, RoleAttackModel, LibraryUtil, CostModel, ClassType, RarityType } from "hearthstone-core";
import { AbusiveSergeantBattlecryModel } from "./battlecry";

@LibraryUtil.is('abusive-sergeant')
export class AbusiveSergeantModel extends MinionCardModel {
    constructor(props?: AbusiveSergeantModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant',
                desc: 'Battlecry: Give a minion +2 Attack this turn.',
                isCollectible: true,
                flavorDesc: 'ADD ME TO YOUR DECK, MAGGOT!',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                battlecry: props.child?.battlecry ?? [new AbusiveSergeantBattlecryModel()],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}