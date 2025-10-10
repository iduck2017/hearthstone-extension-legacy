import { RoleAttackModel, CostModel, RoleHealthModel, MinionCardModel, RoleModel, LibraryUtil, ClassType, RaceType, RarityType } from "hearthstone-core";

@LibraryUtil.is('wisp')
export class WispModel extends MinionCardModel {
    constructor(props?: WispModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                isCollectible: false,
                races: [RaceType.UNDEAD],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 } }),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        health: new RoleHealthModel({ state: { origin: 1 } }),
                        attack: new RoleAttackModel({ state: { origin: 1 } }),
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }
}