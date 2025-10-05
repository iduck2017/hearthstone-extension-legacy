import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, RoleModel, RoleEntriesModel, TauntModel, CostModel, LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('gnoll')
export class GnollModel extends MinionCardModel {
    constructor(loader?: Loader<GnollModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Gnoll",
                    desc: "Taunt",
                    flavorDesc: "",
                    cost: 0,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    isCollectible: false,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 2 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 2 }})),
                            entries: new RoleEntriesModel(() => ({
                                child: {
                                    taunt: new TauntModel()
                                }
                            }))
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
