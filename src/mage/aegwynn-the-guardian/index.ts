/**
 * Aegwynn, the Guardian
 * With Medivh as her son, nothing YOU do could ever disappoint her.
 * 
 * Spell Damage +2 Deathrattle: The next minion you draw inherits these powers.
 * 
 * Type: Minion
 * Rarity: Legendary
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 1600 / 3200 (Golden)
 * Disenchanting Yield: 400 / 1600 (Golden)
 * Artist: Luke Mancini
 * Collectible
 */
import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RarityType, SpellDamageModel, LibraryUtil, CostModel } from "hearthstone-core";
import { AegwynnTheGuardianDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('aegwynn-the-guardian')
export class AegwynnTheGuardianModel extends MinionCardModel {
    constructor(props?: AegwynnTheGuardianModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Aegwynn, the Guardian',
                desc: 'Spell Damage +2 Deathrattle: The next minion you draw inherits these powers.',
                collectible: true,
                flavorDesc: 'With Medivh as her son, nothing YOU do could ever disappoint her.',
                rarity: RarityType.LEGENDARY,
                class: ClassType.MAGE,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 5 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                feats: props.child?.feats ?? [
                    new SpellDamageModel({ state: { offset: 2 }}),
                    new AegwynnTheGuardianDeathrattleModel()
                ],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}
