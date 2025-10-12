import { RoleAttackModel, ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleModel, MinionFeaturesModel } from "hearthstone-core";
import { LeperGnomeDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('leper-gnome')
export class LeperGnomeModel extends MinionCardModel {
    constructor(props?: LeperGnomeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Leper Gnome',
                desc: 'Deathrattle: Deal 2 damage to the enemy hero.',
                isCollectible: true,
                flavorDesc: 'He really just wants to be your friend, but the constant rejection is starting to really get to him.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        health: new RoleHealthModel({ state: { origin: 1 }}),
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                    },
                }),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { deathrattle: [new LeperGnomeDeathrattleModel()] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}