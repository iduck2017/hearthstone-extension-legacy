import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, RoleModel, MinionHooksModel, CostModel, LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";
import { HoggerEndTurnModel } from "./end-turn";

@LibraryUtil.is('hogger')
export class HoggerModel extends MinionCardModel {
    constructor(loader?: Loader<HoggerModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Hogger",
                    desc: "At the end of your turn, summon a 2/2 Gnoll with Taunt.",
                    flavorDesc: "Hogger is super powerful. If you kill him, it's because he let you.",
                    cost: 6,
                    rarity: RarityType.LEGENDARY,
                    class: ClassType.NEUTRAL,
                    races: [],
                    isCollectible: true,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 6 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 4 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 4 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: {
                            endTurn: [new HoggerEndTurnModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
