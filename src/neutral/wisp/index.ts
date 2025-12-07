import { RoleAttackModel, CostModel, RoleHealthModel, MinionCardModel, LibraryService, ClassType, RaceType, RarityType } from "hearthstone-core";

@LibraryService.is('wisp')
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
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 } }),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 } }),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }
}