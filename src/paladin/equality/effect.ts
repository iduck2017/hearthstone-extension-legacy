import { Selector, SpellEffectModel, RoleFeatureModel, RoleHealthModel, RoleHealthDecor, OperatorType } from "hearthstone-core";
import { TemplUtil, StateUtil } from "set-piece";

@TemplUtil.is('equality-effect')
export class EqualityEffectModel extends SpellEffectModel<never> {
    constructor(props?: EqualityEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Equality's effect",
                desc: "Change the Health of ALL minions to 1.",
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
        const game = this.route.game;
        if (!game) return;

        // Get all minions on the board
        const minions = game.refer.minions;

        // Change the Health of ALL minions to 1 using a feature that sets health to 1
        for (const minion of minions) {
            minion.buff(new EqualityFeatureModel());
        }
    }
}

@TemplUtil.is('equality-feature')
class EqualityFeatureModel extends RoleFeatureModel {
    constructor(props?: EqualityFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Equality's Buff",
                desc: "Health changed to 1.",
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @StateUtil.on(self => self.modifyHealth)
    private listenHealth() {
        return this.route.role?.proxy.child.health.decor;
    }
    private modifyHealth(that: RoleHealthModel, decor: RoleHealthDecor) {
        decor.add({
            type: OperatorType.SET,
            offset: 1,
            method: this,
        });
    }
}

