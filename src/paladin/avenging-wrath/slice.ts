import { DamageEvent, DamageModel, DamageType, EffectModel } from "hearthstone-core";

export class AvengingWrathSliceEffectModel extends EffectModel<never> {
    constructor(props?: AvengingWrathSliceEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Avenging Wrath Slice's effect",
                desc: "Deal 1 damage randomly to an enemy.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck() { return undefined }

    protected async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;

        const roles = opponent.refer.roles;
        if (!roles.length) return;
        const index = Math.floor(Math.random() * roles.length);
        const target = roles[index];
        if (!target) return;
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 1,
            })
        ])
    }
}

