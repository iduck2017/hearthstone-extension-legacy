import { BattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { ArathiWeaponModel } from "./weapon";

@TemplUtil.is('arathi-weaponsmith-battlecry')
export class ArathiWeaponsmithBattlecryModel extends BattlecryModel<never> {
    constructor(props?: ArathiWeaponsmithBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Arathi Weaponsmith's Battlecry",
                desc: "Equip a 2/2 weapon.",
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): never | undefined {
        return undefined;
    }

    public async doRun(params: Array<never | undefined>) {
        const player = this.route.player;
        if (!player) return;
        const hero = player.child.hero;
        
        // Create and equip a 2/2 weapon
        const weapon = new ArathiWeaponModel();
    }
}

