import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, RoleModel, RoleFeatsModel, TauntModel, MinionHooksModel, CostModel, LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('lord-of-the-arena')
export class LordOfTheArenaModel extends MinionCardModel {
    constructor(loader?: Loader<LordOfTheArenaModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Lord of the Arena",
                    desc: "Taunt",
                    flavorDesc: "He used to be a 2100+ rated arena player, but that was years ago and nobody can get him to shut up about it.",
                    cost: 6,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    isCollectible: true,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 6 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 6 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 5 }})),
                            feats: new RoleFeatsModel(() => ({
                                child: {
                                    taunt: new TauntModel()
                                }
                            }))
                        }
                    })),
                    feats: new MinionHooksModel(() => ({
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
