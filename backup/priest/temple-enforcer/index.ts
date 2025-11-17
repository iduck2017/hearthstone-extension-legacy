import { RoleAttackModel, ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, MinionFeaturesModel, RaceType } from "hearthstone-core";
import { TempleEnforcerBattlecryModel } from "./battlecry";

@LibraryUtil.is('temple-enforcer')
export class TempleEnforcerModel extends MinionCardModel {
    constructor(props?: TempleEnforcerModel['props']) {
        props = props ?? {};
        super({
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
                cost: props.child?.cost ??  new CostModel({ state: { origin: 5 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 6 }}),
                feats: props.child?.feats ?? [new TempleEnforcerBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
