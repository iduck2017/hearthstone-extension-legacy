import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, RoleModel, MinionHooksModel, CostModel, LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";
import { PriestessOfEluneBattlecryModel } from "./battlecry";

@LibraryUtil.is('priestess-of-elune')
export class PriestessOfEluneModel extends MinionCardModel {
    constructor(loader?: Loader<PriestessOfEluneModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Priestess of Elune",
                    desc: "Battlecry: Restore 4 Health to your hero.",
                    flavorDesc: "If she threatens to \"moon\" you, it's not what you think.",
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
                            attack: new RoleAttackModel(() => ({ state: { origin: 5 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 4 }})),
                        }
                    })),
                    feats: new MinionHooksModel(() => ({
                        child: {
                            battlecry: [new PriestessOfEluneBattlecryModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
