import { Loader } from "set-piece";
import { RoleAttackModel, ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleModel, MinionFeatsModel, RaceType } from "hearthstone-core";
import { TempleEnforcerBattlecryModel } from "./battlecry";

@LibraryUtil.is('temple-enforcer')
export class TempleEnforcerModel extends MinionCardModel {
    constructor(loader?: Loader<TempleEnforcerModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Temple Enforcer',
                    desc: 'Battlecry: Give a friendly minion +3 Health.',
                    isCollectible: true,
                    flavorDesc: 'He also moonlights Thursday nights as a bouncer at the Pig and Whistle Tavern.',
                    rarity: RarityType.COMMON,
                    class: ClassType.PRIEST,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 5 }})),
                    role: new RoleModel(() => ({
                        child: {
                            health: new RoleHealthModel(() => ({ state: { origin: 6 }})),
                            attack: new RoleAttackModel(() => ({ state: { origin: 5 }})),
                        },
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { battlecry: [new TempleEnforcerBattlecryModel()] }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
