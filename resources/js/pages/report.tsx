import { InputSearch } from '@/components/input-search';
import { SimpleTable } from '@/components/simple-table';
import AppLayout from '@/layouts/app-layout';
import { names } from '@/lib/utils';
import { IReport, IReportFetch, IReportProps } from '@/types/report';
import { DeleteOutlined, DownloadOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import Done from '@svg/done.svg';
import NotComplete from '@svg/not_complete.svg';
import { Button, Calendar, DatePicker, Flex, Popover } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'lodash';
import { useMemo } from 'react';

export default function Report(props: IReportProps) {
    const {
        paginated: { data, last_page, per_page, current_page },
        year,
        keyword,
        sorted,
    } = props;

    console.log({ props });

    const onDateClick = (day: Dayjs | undefined, item: IReport) => {
        const date = day?.format('YYYY-MM-DD');
        router.visit(route(names.reports.show, { id: item.id }), {
            data: {
                date,
            },
        });
    };

    const fetchData = (props: IReportFetch) => {
        router.get(route(names.reports.index), {
            year,
            keyword,
            page: current_page,
            page_size: per_page,
            ...props,
        });
    };
    const handleSearch = useMemo(
        () =>
            debounce((value) => {
                fetchData({ keyword: value });
            }, 1500),
        [],
    );

    const handleYear = (year: Dayjs) => {
        fetchData({ year: year.format('YYYY') });
    };

    return (
        <AppLayout header="Vendor Fund Report">
            <Head title="Report" />
            <div className="rounded-2xl p-4">
                <SimpleTable<IReport>
                    dataSource={data}
                    fetchData={fetchData}
                    sorted={sorted}
                    pagination={{
                        current_page,
                        last_page,
                        per_page,
                        onPageChange: (page) => fetchData({ page }),
                        onPageSizeChange: (page_size) => fetchData({ page_size }),
                    }}
                    headerComponent={() => {
                        return (
                            <Flex gap={4} className="mb-4! w-full flex-col sm:flex-row">
                                <InputSearch handleChange={handleSearch} defaultValue={keyword} />
                                <Flex gap={4} className="w-full flex-wrap justify-end">
                                    <DatePicker
                                        picker="year"
                                        className="w-[80px] min-w-[80px]"
                                        defaultValue={dayjs(year)}
                                        onChange={(v) => handleYear(v)}
                                        allowClear={false}
                                    />
                                    <Button variant="solid" type="primary" onClick={() => router.post(route(names.reports.store))}>
                                        <PlusOutlined />
                                        Period
                                    </Button>
                                </Flex>
                            </Flex>
                        );
                    }}
                    columns={[
                        {
                            title: 'Period',
                            dataIndex: 'period',
                            key: 'period',
                            isSortable: true,
                            render(v) {
                                return new Date(v).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
                            },
                        },
                        {
                            title: 'Status',
                            dataIndex: 'is_complete',
                            key: 'is_complete',
                            render(v, r) {
                                const dateMap = r.details.reduce((acc: any, curr) => {
                                    acc[curr.date] = true;
                                    return acc;
                                }, {});

                                return (
                                    <Popover
                                        trigger={'click'}
                                        content={() => (
                                            <div className="max-w-[300px]">
                                                <Calendar
                                                    fullscreen={false}
                                                    validRange={[dayjs(r.period), dayjs(r.period).endOf('month')]}
                                                    defaultValue={dayjs(r.period)}
                                                    onSelect={(date) => onDateClick(date, r)}
                                                    cellRender={(date) =>
                                                        dateMap?.[date.format('YYYY-MM-DD')] && (
                                                            <p className="absolute inset-0 top-2 text-gray-300">•</p>
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                    >
                                        <div className="flex cursor-pointer gap-1">
                                            <img src={v ? Done : NotComplete} />
                                            <p className={`${v ? 'text-green-700' : 'text-[#DC6803]'}`}>{v ? 'Done' : 'Not Complete'}</p>
                                        </div>
                                    </Popover>
                                );
                            },
                        },
                        {
                            title: 'Working Days',
                            dataIndex: 'working_days',
                            key: 'working_days',
                            render: (v) => `${v.toString()} days`,
                        },
                        {
                            title: 'Action',
                            dataIndex: '',
                            key: 'action',
                            render: (_, r) => {
                                return (
                                    <Popover
                                        classNames={{ body: 'p-0!' }}
                                        trigger="click"
                                        content={() => (
                                            <Flex vertical align="center" justify="center" gap={1}>
                                                <Button
                                                    className="rounded-b-none! border-none! p-6! hover:!bg-[#FD79001A] focus:bg-[#FD79001A]"
                                                    type="text"
                                                >
                                                    <DeleteOutlined style={{ color: 'red', marginRight: 4 }} />
                                                    Delete
                                                </Button>
                                                <Button
                                                    className="rounded-t-none! border-none! p-6! hover:!bg-[#FD79001A] focus:bg-[#FD79001A]"
                                                    type="text"
                                                >
                                                    <DownloadOutlined style={{ color: '#FD7900', marginRight: 4 }} />
                                                    Export
                                                </Button>
                                            </Flex>
                                        )}
                                    >
                                        <MoreOutlined style={{ color: '#FD7900', fontSize: 25 }} />
                                    </Popover>
                                );
                            },
                        },
                    ]}
                />
            </div>
        </AppLayout>
    );
}
