import { useAppContext } from '@/layouts/app-provider';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Input, Select, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { JSX } from 'react';
import { TSortDirection } from './sort';
import { TitleSort } from './title-sort';

type CustomColumnType<T> = ColumnType<T> & {
    isSortable?: boolean;
};
type CustomColumnsType<T> = CustomColumnType<T>[];

interface ISimpleTableProps<T> {
    dataSource: Array<T>;
    pagination?: {
        current_page: number;
        last_page: number;
        per_page: number;
        onPageChange?: (page: number) => void;
        onPageSizeChange?: (page_size: number) => void;
    };
    columns: CustomColumnsType<T>;
    sorted?: Partial<Record<keyof T, TSortDirection>>;
    fetchData?: (props: any) => void;
    headerComponent?: () => JSX.Element;
    isPadding?: boolean;
}

export function SimpleTable<T>(props: ISimpleTableProps<T>) {
    const { isMobile } = useAppContext();
    const newColumns = props.columns.map(({ isSortable, ...column }) => {
        return {
            ...column,
            title:
                isSortable && props.sorted ? (
                    <TitleSort<T>
                        name={column.dataIndex as keyof T}
                        sorted={props.sorted}
                        title={column.title as string}
                        fetchData={props?.fetchData}
                    />
                ) : (
                    column.title
                ),
        };
    });
    return (
        <div
            className={`h-full gap-2 rounded-2xl ${props.isPadding || props.isPadding === undefined ? 'p-4' : ''} shadow-[0px_4px_3px_0px_#4852610F]`}
        >
            {props.headerComponent?.()}
            <div className="overflow-hidden">
                <Table
                    scroll={{ x: 'max-content' }}
                    sticky={!isMobile}
                    className="mt-2 max-h-[69dvh] overflow-scroll"
                    pagination={false}
                    dataSource={props.dataSource}
                    columns={newColumns}
                />
            </div>
            {props.pagination && (
                <div className="flex items-center justify-end gap-2 pt-4 font-semibold">
                    <p>Rows per page</p>
                    <Select
                        defaultValue={props.pagination.per_page}
                        className="w-14!"
                        onChange={props.pagination?.onPageSizeChange}
                        options={[
                            { label: '10', value: 10 },
                            { label: '20', value: 20 },
                            { label: '30', value: 30 },
                            { label: '50', value: 50 },
                        ]}
                    />
                    <Button
                        variant="text"
                        type="text"
                        className="aspect-square bg-[#FAFAFA]!"
                        disabled={props.pagination.current_page === 1}
                        onClick={() => props.pagination?.onPageChange?.(props.pagination.current_page - 1)}
                    >
                        <LeftOutlined />
                    </Button>
                    <Input
                        className="aspect-square max-w-8"
                        defaultValue={props.pagination.current_page}
                        max={props.pagination.last_page}
                        min={1}
                        onChange={(e) => props.pagination?.onPageChange?.(+e.target.value)}
                    />
                    <p className="text-[#9E9D9D]">of {props.pagination.last_page}</p>
                    <Button
                        variant="text"
                        type="text"
                        className="aspect-square bg-[#FAFAFA]!"
                        disabled={props.pagination.current_page === props.pagination.last_page}
                        onClick={() => props.pagination?.onPageChange?.(props.pagination.current_page + 1)}
                    >
                        <RightOutlined />
                    </Button>
                </div>
            )}
        </div>
    );
}
