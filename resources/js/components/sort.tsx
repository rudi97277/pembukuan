import { ArrowDownOutlined, ArrowUpOutlined, SwapOutlined } from '@ant-design/icons';
import { JSX } from 'react';

export type TSortDirection = 'asc' | 'desc' | null | undefined;

function SortArrow({ direction }: { direction: TSortDirection }): JSX.Element | null {
    return direction === undefined ? (
        <></>
    ) : direction === null ? (
        <SwapOutlined style={{ transform: 'rotate(90deg)', fontSize: 12, color: 'grey' }} />
    ) : direction === 'asc' ? (
        <ArrowUpOutlined style={{ color: 'green' }} />
    ) : (
        <ArrowDownOutlined style={{ color: 'red' }} />
    );
}

export { SortArrow };
