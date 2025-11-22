import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RarityType, RaceType, RushModel, CostModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('emerald-skytalon')
export class EmeraldSkytalonModel extends MinionCardModel {
    constructor(props?: EmeraldSkytalonModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Emerald Skytalon',
                desc: 'Rush',
                isCollectible: true,
                flavorDesc: 'Sworn protectors of Ysera at the Emerald Dragonshrine, these majestic owls have been touched by the powers of the Emerald Dream, taking on an almost crystalline appearance.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST, RaceType.ELEMENTAL],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                rush: props.child?.rush ?? new RushModel(),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}