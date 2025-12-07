import { Selector, SpellEffectModel, BaseFeatureModel, RoleAttackBuffModel, RoleHealthBuffModel, WeaponAttackBuffModel, WeaponActionkBuffModel } from "hearthstone-core";
import { DebugService, ChunkService } from "set-piece";
import { HeavyAxeModel } from "../heavy-axe";

@ChunkService.is('upgrade-effect')
export class UpgradeEffectModel extends SpellEffectModel<never> {
    constructor(props?: UpgradeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Upgrade!'s effect",
                desc: "If you have a weapon, give it +1/+1. Otherwise equip a 1/3 weapon.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const hero = player.child.hero;
        const weapon = hero.child.weapon;
        
        if (weapon) {
            // If you have a weapon, give it +1/+1
            weapon.buff(new BaseFeatureModel({
                state: {
                    name: "Upgrade!'s Buff",
                    desc: "+1/+1.",
                },
                child: {
                    buffs: [
                        new WeaponAttackBuffModel({ state: { offset: 1 } }),
                        new WeaponActionkBuffModel({ state: { offset: 1 } })
                    ]
                },
            }));
        } else {
            // Otherwise equip a 1/3 weapon
            const weapon = new HeavyAxeModel();
            hero.equip(weapon);
        }
    }
}

