import { BuffModel, FilterType } from "hearthstone-core";

export class ShatteredSunClericBuffModel extends BuffModel {
    constructor(props: ShatteredSunClericBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Shattered Sun Cleric\'s Buff',
                desc: '+1/+1',
                offset: [1, 1],
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}