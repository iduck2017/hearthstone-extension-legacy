// Murloc Tidehunter - Battlecry: Summon a 1/1 Murloc Scout
// Type: Minion, Minion Type: Murloc, Rarity: Free, Set: Legacy, Class: Neutral

import { CardModel, ClassType, HealthModel, MinionCardModel, MinionHooksModel, RaceType, RarityType, RoleAttackModel, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('murloc-tidehunter')
export class MurlocTidehunterModel extends MinionCardModel {
    constructor(loader?: Loader<MurlocTidehunterModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Murloc Tidehunter',
                    desc: 'Battlecry: Summon a 1/1 Murloc Scout.',
                    isCollectible: true,
                    flavorDesc: '"Death will rise, from the tides!"',
                    rarity: RarityType.COMMON,
                    races: [RaceType.MURLOC],
                    class: ClassType.NEUTRAL,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    role: new RoleModel(() => ({
                        state: { races: [RaceType.MURLOC] },
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 2 }})),
                            health: new HealthModel(() => ({ state: { origin: 1 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { battlecry: [] }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
