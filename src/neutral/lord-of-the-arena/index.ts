import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, TauntModel, MinionFeaturesModel, CostModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('lord-of-the-arena')
export class LordOfTheArenaModel extends MinionCardModel {
    constructor(props?: LordOfTheArenaModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Lord of the Arena",
                desc: "Taunt",
                flavorDesc: "He used to be a 2100+ rated arena player, but that was years ago and nobody can get him to shut up about it.",
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                isCollectible: true,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 6 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 6 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        taunt: new TauntModel(),
                        battlecry: []
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
