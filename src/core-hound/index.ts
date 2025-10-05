import { MinionCardModel, RarityType, ClassType, RaceType, RoleAttackModel, RoleHealthModel, RoleModel, MinionHooksModel, CostModel, LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('core-hound')
export class CoreHoundModel extends MinionCardModel {
    constructor(loader?: Loader<CoreHoundModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Core Hound",
                    desc: "",
                    flavorDesc: "You don't tame a Core Hound. You just train it to eat someone else before it eats you.",
                    cost: 7,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.BEAST],
                    isCollectible: true,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 7 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 9 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 5 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: {
                            battlecry: []
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
