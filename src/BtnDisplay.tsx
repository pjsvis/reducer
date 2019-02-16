import * as React from 'react'
import { AdviceActionType} from '././AdviceForms'

interface Props {
    action: AdviceActionType;
    onClick(): void;
}
export const BtnDisplay = (props: Props) => {
    const { action, onClick } = props;
    return (
        <button className="btn btn-sm btn-primary mr1 mt1" onClick={onClick}>
            {action.toLowerCase()}
        </button>
    );
};