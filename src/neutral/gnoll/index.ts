import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, TauntModel, CostModel, LibraryService } from "hearthstone-core";

@LibraryService.is('gnoll')
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
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                taunt: props.child?.taunt ?? new TauntModel(),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
