import { InputSearch } from '@/components/input-search';
import { Meal } from '@/components/meal';
import { SimpleTable } from '@/components/simple-table';
import { VendorModal } from '@/components/vendor-modal';
import AppLayout from '@/layouts/app-layout';
import { names } from '@/lib/utils';
import { IReportDetail, IReportDetailFetch, IReportDetailProps } from '@/types/report-detail';
import { DeleteOutlined, LeftOutlined, MoreOutlined } from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import { Button, DatePicker, Flex, Form, Popover, Select, Switch } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'lodash';
import { useMemo, useState } from 'react';

export default function ReportDetail(props: IReportDetailProps) {
    const {
        paginated: { data, last_page, per_page, current_page },
        keyword,
        date,
        report_id,
        used_dates,
        division,
        divisions,
        sorted,
    } = props;

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleChangeMeal = (report_id: number, detail_id: number, values: any) => {
        router.put(route(names.reports.details.update, { report: report_id, detail: detail_id }), values);
    };

    const fetchData = (props: IReportDetailFetch) => {
        router.get(
            route(names.reports.show, { id: report_id }),
            {
                page: current_page,
                page_size: per_page,
                keyword,
                date,
                division,
                ...props,
            },
            { preserveScroll: true },
        );
    };

    const handleSearch = useMemo(
        () =>
            debounce((value) => {
                fetchData({ keyword: value });
            }, 1500),
        [],
    );

    const handleDivision = (v: string) => {
        fetchData({ division: v });
    };

    const handleDate = (date: Dayjs) => {
        fetchData({ date: date.format('YYYY-MM-DD') });
    };

    const renderDate = (date: Dayjs | number | string) => {
        const dateMap = used_dates.reduce((acc: any, curr) => {
            acc[curr.date] = true;
            return acc;
        }, {});
        const formatted = dayjs(date).format('YYYY-MM-DD');
        const isToday = dayjs().isSame(date, 'day');
        const isSelected = dayjs(date).isSame(date, 'day');

        const classes = ['ant-picker-cell-inner', isToday && 'ant-picker-cell-today', isSelected && 'ant-picker-cell-selected']
            .filter(Boolean)
            .join(' ');

        return (
            <div className={`relative ${classes}`}>
                <p className="text-center">{dayjs(date).format('DD')}</p>
                {dateMap?.[formatted] && <div className="pointer-events-none absolute inset-0 top-2 text-gray-300">•</div>}
            </div>
        );
    };

    const submitVendor = async () => {
        form.validateFields().then((values) => {
            router.post(route(names.reports.details.store, { report: report_id }), { ...values, date: date });
            setIsModalOpen(false);
            form.resetFields();
        });
    };

    const handleDeleteDetail = (id: number) => {
        router.delete(route(names.reports.details.delete, { report: report_id, detail: id }));
    };

    return (
        <AppLayout
            header={
                <Flex gap={8} align="center" className="h-full w-full">
                    <Button variant="text" color="primary" icon={<LeftOutlined />} onClick={() => router.get(route(names.reports.index))} />
                    <p>{dayjs(props.date).format('dddd, DD MMMM YYYY')}</p>
                </Flex>
            }
        >
            <Head title="Report Detail" />
            <VendorModal
                date={props.date}
                divisions={divisions}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                form={form}
                submitVendor={submitVendor}
            />
            <div className="rounded-2xl p-4">
                <SimpleTable<IReportDetail>
                    dataSource={data}
                    fetchData={fetchData}
                    pagination={{
                        current_page,
                        last_page,
                        per_page,
                        onPageSizeChange: (page_size) => fetchData({ page_size }),
                        onPageChange: (page) => fetchData({ page }),
                    }}
                    sorted={sorted}
                    headerComponent={() => {
                        return (
                            <Flex gap={4} className="mb-4! w-full flex-col sm:flex-row">
                                <InputSearch handleChange={handleSearch} defaultValue={keyword} />
                                <Flex gap={4} className="w-full flex-wrap justify-end">
                                    <DatePicker
                                        className="!w-[120px]"
                                        defaultValue={dayjs(date)}
                                        onChange={(v) => handleDate(v)}
                                        minDate={dayjs(date).startOf('month')}
                                        maxDate={dayjs(date).endOf('month')}
                                        allowClear={false}
                                        showNow={false}
                                        cellRender={(date) => renderDate(date)}
                                    />
                                    <Select
                                        defaultValue={division}
                                        className="!w-[120px]"
                                        placeholder="All Division"
                                        onChange={handleDivision}
                                        options={[
                                            {
                                                label: 'All Division',
                                                value: '',
                                            },
                                            ...divisions,
                                        ]}
                                    />
                                    <Button variant="solid" type="primary" onClick={() => setIsModalOpen(true)}>
                                        Create Vendor
                                    </Button>
                                </Flex>
                            </Flex>
                        );
                    }}
                    columns={[
                        {
                            title: 'No',
                            dataIndex: '',
                            key: 'no',
                            render: (_, _r, index) => index + 1,
                            width: 60,
                        },
                        {
                            title: 'Employee Name',
                            dataIndex: 'name',
                            key: 'name',
                            isSortable: true,
                            width: 100,
                        },
                        {
                            title: 'Division',
                            dataIndex: 'division',
                            key: 'division',
                            isSortable: true,
                            width: 90,
                        },
                        {
                            title: 'Breakfast',
                            dataIndex: 'breakfast',
                            key: 'breakfast',
                            align: 'center',
                            render(v, r) {
                                return <Meal value={v} onChange={(v) => handleChangeMeal(report_id, r.id, { breakfast: v })} />;
                            },
                        },
                        {
                            title: 'Lunch',
                            dataIndex: 'lunch',
                            align: 'center',
                            render(v, r) {
                                return <Meal value={v} onChange={(v) => handleChangeMeal(report_id, r.id, { lunch: v })} />;
                            },
                        },
                        {
                            title: 'Dinner',
                            dataIndex: 'dinner',
                            align: 'center',
                            render(v, r) {
                                return <Meal value={v} onChange={(v) => handleChangeMeal(report_id, r.id, { dinner: v })} />;
                            },
                        },
                        {
                            title: 'Claim Save',
                            dataIndex: 'is_claim_save',
                            key: 'is_claim_save',
                            render(v, r) {
                                return <Switch checked={v} onChange={(v) => handleChangeMeal(report_id, r.id, { is_claim_save: v })} />;
                            },
                        },
                        {
                            title: 'Claim Total',
                            dataIndex: 'claim_total',
                            key: 'claim-total',
                            isSortable: true,
                            width: 150,
                            render: (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v),
                        },
                        {
                            title: 'Save Total',
                            dataIndex: 'save_total',
                            key: 'save-total',
                            width: 150,
                            isSortable: true,
                            render: (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v),
                        },
                        {
                            title: 'Action',
                            dataIndex: '',
                            key: 'action',
                            width: 80,
                            render: (_, r) => {
                                return (
                                    <Popover
                                        classNames={{ body: 'p-0!' }}
                                        trigger="click"
                                        content={() => (
                                            <Flex vertical align="center" justify="center" gap={1}>
                                                <Button
                                                    onClick={() => handleDeleteDetail(r.id)}
                                                    className="rounded-b-none! border-none! p-6! hover:!bg-[#FD79001A] focus:bg-[#FD79001A]"
                                                    type="text"
                                                >
                                                    <DeleteOutlined style={{ color: 'red', marginRight: 4 }} />
                                                    Delete
                                                </Button>
                                            </Flex>
                                        )}
                                    >
                                        <MoreOutlined style={{ color: '#FD7900', fontSize: 20 }} />
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
