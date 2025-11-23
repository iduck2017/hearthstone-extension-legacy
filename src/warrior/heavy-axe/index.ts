import { ClassType, CostModel, WeaponActionModel, RarityType, WeaponAttackModel, WeaponCardModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('heavy-axe')
export class HeavyAxeModel extends WeaponCardModel {
    constructor(props?: HeavyAxeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Heavy Axe",
                desc: "",
                flavorDesc: "",
                class: ClassType.WARRIOR,
                rarity: RarityType.COMMON,
                isCollectible: false,
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 }}),
                attack: new WeaponAttackModel({ state: { origin: 1 }}),
                action: new WeaponActionModel({ state: { origin: 3 }}),
                ...props.child
            },
            refer: { ...props.refer }
        })
    }
}

