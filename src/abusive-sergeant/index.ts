import { MinionModel, HealthModel, AttackModel, RoleModel, MinionHooksModel, LibraryUtil, CostModel } from "hearthstone-core";
import { AbusiveSergeantBattlecryModel } from "./battlecry";
import { ClassType, RarityType } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('abusive-sergeant')
export class AbusiveSergeantModel extends MinionModel {
    constructor(loader?: Loader<AbusiveSergeantModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Abusive Sergeant',
                    desc: 'Battlecry: Give a minion +2 Attack this turn.',
                    isCollectible: true,
                    flavorDesc: 'ADD ME TO YOUR DECK, MAGGOT!',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new AttackModel(() => ({ state: { origin: 2 }})),
                            health: new HealthModel(() => ({ state: { origin: 1 }})),   
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { battlecry: [new AbusiveSergeantBattlecryModel()] }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
}