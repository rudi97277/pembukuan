import { SwapLeftOutlined, SwapOutlined } from '@ant-design/icons';
import { JSX } from 'react';

export type TSortDirection = 'asc' | 'desc' | null | undefined;

function SortArrow({ direction }: { direction: TSortDirection }): JSX.Element | null {
    return direction === undefined ? (
        <></>
    ) : direction === null ? (
        <SwapOutlined style={{ transform: 'rotate(90deg)', fontSize: 12, color: 'grey' }} />
    ) : direction === 'asc' ? (
        <SwapLeftOutlined style={{ rotate: '90deg', color: 'green' }} />
    ) : (
        <SwapLeftOutlined style={{ rotate: '-90deg', color: 'red' }} />
    );
}

export { SortArrow };
