import { BuffModel } from "hearthstone-core";

export class ShatteredSunClericBuffModel extends BuffModel {
    constructor(props: ShatteredSunClericBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Shattered Sun Cleric\'s Buff',
                desc: '+1/+1',
                attack: 1,
                health: 1,
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}