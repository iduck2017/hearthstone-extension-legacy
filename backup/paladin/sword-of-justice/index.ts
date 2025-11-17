import { ClassType, CostModel, LibraryUtil, RarityType, WeaponCardModel, WeaponAttackModel, WeaponActionModel } from "hearthstone-core";

@LibraryUtil.is('sword-of-justice')
export class SwordOfJusticeModel extends WeaponCardModel {
    constructor(props?: SwordOfJusticeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Sword of Justice",
                desc: "After you summon a minion, give it +1/+1 and this loses 1 Durability.",
                flavorDesc: "I dub you Sir Loin of Beef!",
                class: ClassType.PALADIN,
                rarity: RarityType.EPIC,
                isCollectible: true,
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                attack: new WeaponAttackModel({ state: { origin: 1 }}),
                action: new WeaponActionModel({ state: { origin: 5 }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

