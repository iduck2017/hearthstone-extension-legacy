import { MinionCardModel, HealthModel, RoleAttackModel, RoleModel, LibraryUtil, CostModel, MinionHooksModel } from "hearthstone-core";
import { ElvenArcherRoleBattlecryModel } from "./battlecry";
import { ClassType, RarityType } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('elven-archer')
export class ElvenArcherModel extends MinionCardModel {
    constructor(loader?: Loader<ElvenArcherModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Elven Archer',
                    desc: 'Battlecry: Deal 1 damage.',
                    isCollectible: true,
                    flavorDesc: 'Don\'t bother asking her out on a date. She\'ll shoot you down.',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { current: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { current: 1 }})),
                            health: new HealthModel(() => ({ state: { origin: 1 }})),   
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { battlecry: [new ElvenArcherRoleBattlecryModel()] }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
}