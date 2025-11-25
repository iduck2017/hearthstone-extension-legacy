import { FeatureModel, WeaponCardModel, WeaponPerformModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('truesilver-champion-feature')
export class TruesilverChampionFeatureModel extends FeatureModel {
    constructor(props?: TruesilverChampionFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Truesilver Champion's feature",
                desc: "Whenever your hero attacks, restore 3 Health to it.",
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleAttack)
    protected listenAttack() {
        const player = this.route.player;
        if (!player) return;
        const hero = player.proxy.child.hero;
        if (!hero) return;
        return hero.child.action.event?.onRun;
    }
    protected handleAttack(that: any, event: Event) {
        const weapon = this.route.weapon;
        if (!weapon) return;
        const player = weapon.route.player;
        if (!player) return;
        const hero = player.child.hero;
        
        // Only trigger when hero has this weapon equipped
        if (hero.child.weapon !== weapon) return;
        
        // Restore 3 Health to the hero
        RestoreModel.deal([
            new RestoreEvent({
                source: weapon,
                method: this,
                target: hero,
                origin: 3,
            })
        ]);
    }
}

