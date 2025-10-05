import { MinionCardModel, RarityType, ClassType, RaceType, RoleAttackModel, RoleHealthModel, RoleModel, RoleEntriesModel, TauntModel, MinionHooksModel, CostModel, LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";
import { CairneBloodhoofDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('cairne-bloodhoof')
export class CairneBloodhoofModel extends MinionCardModel {
    constructor(loader?: Loader<CairneBloodhoofModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Cairne Bloodhoof",
                    desc: "Taunt Deathrattle: Summon a 5/5 Baine Bloodhoof.",
                    flavorDesc: "Cairne was killed by Garrosh, so... don't put this guy in a Warrior deck. It's pretty insensitive.",
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
                            attack: new RoleAttackModel(() => ({ state: { origin: 5 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 5 }})),
                            entries: new RoleEntriesModel(() => ({
                                child: {
                                    taunt: new TauntModel()
                                }
                            }))
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: {
                            deathrattle: [new CairneBloodhoofDeathrattleModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
