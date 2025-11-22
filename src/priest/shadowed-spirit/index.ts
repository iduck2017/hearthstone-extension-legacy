import { RoleAttackModel, ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RaceType } from "hearthstone-core";
import { ShadowedSpiritDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('shadowed-spirit')
export class ShadowedSpiritModel extends MinionCardModel {
    constructor(props?: ShadowedSpiritModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Shadowed Spirit',
                desc: 'Deathrattle: Deal 3 damage to the enemy hero.',
                isCollectible: true,
                flavorDesc: 'They can\'t all be grim grinning ghosts.',
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                races: [RaceType.UNDEAD],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                deathrattle: props.child?.deathrattle ?? [new ShadowedSpiritDeathrattleModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
