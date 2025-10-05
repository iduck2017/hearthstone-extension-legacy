import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, RoleModel, CostModel, LibraryUtil, TauntModel, RoleEntriesModel } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('baine-bloodhoof')
export class BaineBloodhoofModel extends MinionCardModel {
    constructor(loader?: Loader<BaineBloodhoofModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Baine Bloodhoof",
                    desc: "",
                    flavorDesc: "",
                    cost: 0,
                    rarity: RarityType.LEGENDARY,
                    class: ClassType.NEUTRAL,
                    races: [],
                    isCollectible: false,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 5 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 5 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 5 }})),
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
