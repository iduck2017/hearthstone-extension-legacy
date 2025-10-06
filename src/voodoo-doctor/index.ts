import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RarityType, RaceType, RoleModel, MinionFeatsModel } from "hearthstone-core";
import { VoodooDoctorRoleBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('voodoo-doctor')
export class VoodooDoctorModel extends MinionCardModel {
    constructor(loader?: Loader<VoodooDoctorModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Voodoo Doctor',
                    desc: 'Battlecry: Restore 2 Health.',
                    isCollectible: true,
                    flavorDesc: 'Voodoo is an oft-misunderstood art. But it is art.',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 2 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 1 }})),
                        }
                    })),
                    feats: props.child?.feats ?? new MinionFeatsModel(() => ({
                        child: {
                            battlecry: [new VoodooDoctorRoleBattlecryModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}