import { ClassType, CostModel, WeaponActionModel, RarityType, WeaponAttackModel, WeaponCardModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('arathi-weapon')
export class ArathiWeaponModel extends WeaponCardModel {
    constructor(props?: ArathiWeaponModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Arathi Weapon",
                desc: "",
                flavorDesc: "",
                class: ClassType.WARRIOR,
                rarity: RarityType.COMMON,
                isCollectible: false,
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 }}),
                attack: new WeaponAttackModel({ state: { origin: 2 }}),
                action: new WeaponActionModel({ state: { origin: 2 }}),
                ...props.child
            },
            refer: { ...props.refer }
        })
    }
}

