import { MinionCardModel, RarityType, ClassType, RaceType, RoleAttackModel, RoleHealthModel, RoleModel, MinionFeaturesModel, CostModel, LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('core-hound')
export class CoreHoundModel extends MinionCardModel {
    constructor(props?: CoreHoundModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Core Hound",
                desc: "",
                flavorDesc: "You don't tame a Core Hound. You just train it to eat someone else before it eats you.",
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                isCollectible: true,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 7 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 9 }}),
                        health: new RoleHealthModel({ state: { origin: 5 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        battlecry: []
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
