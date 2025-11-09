/*
 * Azure Drake
 * They initially planned to be the Beryl or Cerulean drakes, but those felt a tad too pretentious.
 *
 * Spell Damage +1 Battlecry: Draw a card.
 *
 * Type: Minion
 * Minion Type: Dragon
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Ben Zhang
 * Collectible
 */
import { MinionCardModel, RoleHealthModel, RoleAttackModel, ClassType, RarityType, RaceType, MinionFeaturesModel, LibraryUtil, CostModel, SpellDamageModel } from "hearthstone-core";
import { AzureDrakeBattlecryModel } from "./battlecry";

@LibraryUtil.is('azure-drake')
export class AzureDrakeModel extends MinionCardModel {
    constructor(props?: AzureDrakeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Azure Drake',
                desc: 'Spell Damage +1 Battlecry: Draw a card.',
                isCollectible: true,
                flavorDesc: 'They initially planned to be the Beryl or Cerulean drakes, but those felt a tad too pretentious.',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [RaceType.DRAGON],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 5 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 4 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        battlecry: [new AzureDrakeBattlecryModel()],
                        feats: [new SpellDamageModel(({ state: { offset: 1 }}))]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 