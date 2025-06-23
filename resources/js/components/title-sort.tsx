import { Flex } from 'antd';
import { SortArrow } from './sort';

type TSortDirection = 'asc' | 'desc' | null | undefined;
interface ITitleSort<T> {
    title: string;
    name: keyof T;
    sorted: Partial<Record<keyof T, TSortDirection>>;
    fetchData: (props: any) => void;
}
export function TitleSort<T>(props: ITitleSort<T>) {
    const direction = props.sorted?.[props.name] || null;
    const cleared = Object.fromEntries(Object.entries(props.sorted).map(([key, _]) => [key, null])) as Partial<Record<keyof T, TSortDirection>>;
    const newSorted = {
        ...cleared,
        [props.name]: direction === 'asc' ? 'desc' : direction === 'desc' ? null : 'asc',
    };

    return (
        <Flex gap={2} align="center" onClick={() => props.fetchData({ sort: newSorted })}>
            <h3 className="text-sm leading-6 font-semibold text-gray-900">{props.title}</h3>
            <SortArrow direction={direction} />
        </Flex>
    );
}
