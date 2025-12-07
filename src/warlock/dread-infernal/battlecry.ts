import { BattlecryModel, DamageModel, DamageEvent, DamageType, RoleModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('dread-infernal-battlecry')
export class DreadInfernalBattlecryModel extends BattlecryModel<never> {
    constructor(props?: DreadInfernalBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Dread Infernal's Battlecry",
                desc: "Deal 1 damage to ALL other characters.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck() {
        return undefined;
    }

    public async doRun() {
        const minion = this.route.minion;
        if (!minion) return;
        const game = this.route.game;
        if (!game) return;

        // Get all characters (heroes and minions) except this minion
        const allRoles = game.refer.roles;
        const otherRoles = allRoles.filter(role => role !== minion);

        // Deal 1 damage to all other characters
        const damageEvents = otherRoles.map(character => 
            new DamageEvent({
                type: DamageType.DEFEND,
                source: minion,
                method: this,
                target: character,
                origin: 1,
            })
        );

        DamageModel.deal(damageEvents);
    }
}

