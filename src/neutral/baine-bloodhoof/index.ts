import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, CostModel, LibraryService } from "hearthstone-core";

@LibraryService.is('baine-bloodhoof')
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
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
