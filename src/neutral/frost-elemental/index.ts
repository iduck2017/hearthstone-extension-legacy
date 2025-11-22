import { MinionCardModel, RarityType, ClassType, RaceType, RoleAttackModel, RoleHealthModel, CostModel, LibraryUtil } from "hearthstone-core";
import { FrostElementalBattlecryModel } from "./battlecry";

@LibraryUtil.is('frost-elemental')
export class FrostElementalModel extends MinionCardModel {
    constructor(props?: FrostElementalModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Frost Elemental",
                desc: "Battlecry: Freeze a character.",
                flavorDesc: "When a Water elemental and an Ice elemental love each other VERY much...",
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.ELEMENTAL],
                isCollectible: true,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 6 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                battlecry: props.child?.battlecry ?? [new FrostElementalBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
