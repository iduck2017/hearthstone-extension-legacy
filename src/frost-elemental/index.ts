import { MinionCardModel, RarityType, ClassType, RaceType, RoleAttackModel, RoleHealthModel, RoleModel, MinionHooksModel, CostModel, LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";
import { FrostElementalBattlecryModel } from "./battlecry";

@LibraryUtil.is('frost-elemental')
export class FrostElementalModel extends MinionCardModel {
    constructor(loader?: Loader<FrostElementalModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Frost Elemental",
                    desc: "Battlecry: Freeze a character.",
                    flavorDesc: "When a Water elemental and an Ice elemental love each other VERY much...",
                    cost: 6,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.ELEMENTAL],
                    isCollectible: true,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 6 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 5 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 5 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: {
                            battlecry: [new FrostElementalBattlecryModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
