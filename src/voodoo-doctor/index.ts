import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RarityType, RaceType, RoleModel, MinionFeaturesModel, CostModel, LibraryUtil } from "hearthstone-core";
import { VoodooDoctorMinionBattlecryModel } from "./battlecry";

@LibraryUtil.is('voodoo-doctor')
export class VoodooDoctorModel extends MinionCardModel {
    constructor(props?: VoodooDoctorModel['props']) {
        props = props ?? {};
        super({
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
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 1 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        battlecry: [new VoodooDoctorMinionBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}