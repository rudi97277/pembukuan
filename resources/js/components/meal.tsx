import { Segmented } from 'antd';
import { JSX } from 'react';

export type TMealSave = 'Meal' | 'Save';
interface IMealProps {
    value: TMealSave;
    className?: string;
    onChange?: (value: TMealSave) => void;
}

export function Meal(props: IMealProps): JSX.Element {
    return <Segmented className={props?.className || ''} options={['Meal', 'Save']} value={props.value} onChange={props.onChange} />;
}
