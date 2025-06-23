import { JSX } from 'react';

interface ILabelProps {
    text: string;
    className?: string;
}
export function Label(props: ILabelProps): JSX.Element {
    return (
        <label className={`text-[#00000080] ${props.className || ''}`}>
            {props.text} <span className="text-red-500">*</span>
        </label>
    );
}
