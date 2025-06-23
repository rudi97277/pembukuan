import { InputSearch } from '@/components/input-search';
import { Label } from '@/components/label';
import { Meal } from '@/components/meal';
import { SimpleTable } from '@/components/simple-table';
import AppLayout from '@/layouts/app-layout';
import { names } from '@/lib/utils';
import { IReportDetail, IReportDetailFetch, IReportDetailProps } from '@/types/report-detail';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import { Button, DatePicker, Divider, Flex, Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
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
    const [type, setType] = useState<string>('vendor');
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
                {dateMap[formatted] && <div className="pointer-events-none absolute inset-0 top-2 text-gray-300">•</div>}
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

    const FormModal = (
        <Modal
            title={
                <div className="flex flex-col gap-3">
                    <Flex className="mb-2 items-center" gap={10}>
                        <div
                            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#FF6A00] p-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <DoubleLeftOutlined style={{ color: 'white' }} />
                        </div>
                        {`Assign Vendor - ${dayjs(props.date).format('DD MMMM YYYY')}`}
                    </Flex>
                    <Divider className="m-0!" />
                </div>
            }
            open={isModalOpen}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            onOk={() => console.log({ a: form.getFieldsValue() })}
            closable={false}
            okText="Save"
            onCancel={() => setIsModalOpen(false)}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="type" noStyle />
                <div className="flex w-full items-end">
                    <Form.Item name="type" label={<Label text="Name" />} initialValue={'vendor'} rules={[{ required: true }]} required={false}>
                        <Select
                            className="min-w-[20px]"
                            placeholder="Type"
                            onChange={(value) => setType(value)}
                            options={[
                                { label: 'Vendor', value: 'vendor' },
                                { label: 'Guest', value: 'guest' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="name" className="w-full" rules={[{ required: true }, { type: 'string' }]}>
                        <Input placeholder="Employee name" />
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        initialValue={1}
                        rules={[{ required: true, message: 'Required' }]}
                        style={{ display: type === 'guest' ? 'block' : 'none' }}
                    >
                        <InputNumber min={1} placeholder="qty" className="max-w-16" />
                    </Form.Item>
                </div>
                <Form.Item name="division" label={<Label text="Division" />} rules={[{ required: true }]} required={false}>
                    <Select placeholder="Division" options={divisions} />
                </Form.Item>
                <Label text="Choice" />
                <div className="mt-2 flex w-full flex-col gap-2 rounded-2xl border border-[#D0D5DD] p-4">
                    <Flex className="items-center justify-end">
                        <Label text="Breakfast" className="me-auto font-bold" />
                        <Form.Item name="breakfast" initialValue={'Meal'} className="mb-0!" rules={[{ required: true }]} required={false}>
                            <Meal value={'Meal'} className="h-full" />
                        </Form.Item>
                    </Flex>
                    <Flex className="items-center justify-end">
                        <Label text="Lunch" className="me-auto font-bold" />
                        <Form.Item name="lunch" initialValue={'Meal'} className="mb-0!" rules={[{ required: true }]} required={false}>
                            <Meal value={'Meal'} className="h-full" />
                        </Form.Item>
                    </Flex>
                    <Flex className="items-center justify-end">
                        <Label text="Dinner" className="me-auto font-bold" />
                        <Form.Item name="dinner" initialValue={'Meal'} className="mb-0!" rules={[{ required: true }]} required={false}>
                            <Meal value={'Meal'} className="h-full" />
                        </Form.Item>
                    </Flex>
                </div>
                <div className="mt-4 flex justify-end gap-4">
                    <div className="mr-auto flex items-center gap-2">
                        <Label text="Claim Save" />
                        <Flex className="items-center justify-end">
                            <Form.Item name="is_claim_save" initialValue={false} className="mb-0!" rules={[{ required: true }]} required={false}>
                                <Switch />
                            </Form.Item>
                        </Flex>
                    </div>
                    <Button variant="solid" type="default" onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="solid" type="primary" htmlType="submit" onClick={submitVendor}>
                        Save
                    </Button>
                </div>
            </Form>
        </Modal>
    );

    return (
        <AppLayout header={`${dayjs(props.date).format('dddd, DD MMMM YYYY')}`}>
            <Head title="Report Detail" />
            {FormModal}
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
                                        minDate={dayjs().startOf('month')}
                                        maxDate={dayjs().endOf('month')}
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
                        },
                        {
                            title: 'Employee Name',
                            dataIndex: 'name',
                            key: 'name',
                            isSortable: true,
                        },
                        {
                            title: 'Division',
                            dataIndex: 'division',
                            key: 'division',
                            isSortable: true,
                        },
                        {
                            title: 'Breakfast',
                            dataIndex: 'breakfast',
                            key: 'breakfast',
                            render(v, r) {
                                return <Meal value={v} onChange={(v) => handleChangeMeal(report_id, r.id, { breakfast: v })} />;
                            },
                        },
                        {
                            title: 'Lunch',
                            dataIndex: 'lunch',
                            render(v, r) {
                                return <Meal value={v} onChange={(v) => handleChangeMeal(report_id, r.id, { lunch: v })} />;
                            },
                        },
                        {
                            title: 'Dinner',
                            dataIndex: 'dinner',
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
                            title: 'Save Total',
                            dataIndex: 'save_total',
                            key: 'save_total',
                            render: (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v),
                        },
                    ]}
                />
            </div>
        </AppLayout>
    );
}
