import { InputSearch } from '@/components/input-search';
import { SimpleTable } from '@/components/simple-table';
import AppLayout from '@/layouts/app-layout';
import { names } from '@/lib/utils';
import { EmployeeReport } from '@/reports/employee';
import { IReportEmployee, IReportEmployeeFetch, IReportEmployeeProps } from '@/types/report-employee';
import { DownloadOutlined, LeftOutlined } from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, Flex, Select } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { debounce } from 'lodash';
import { useMemo } from 'react';

export default function ReportEmployee(props: IReportEmployeeProps) {
    const { data, keyword, period, division, divisions, sorted } = props;

    const fetchData = (props: IReportEmployeeFetch) => {
        router.get(
            route(names.reports.employee),
            {
                keyword,
                period,
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
    return (
        <AppLayout
            header={
                <Flex gap={8} align="center" className="h-full w-full">
                    <Button variant="text" color="primary" icon={<LeftOutlined />} onClick={() => router.get(route(names.reports.index))} />
                    <p>Report Employee</p>
                </Flex>
            }
        >
            <Head title="Report Employee" />

            <div className="rounded-2xl p-4">
                <SimpleTable<IReportEmployee>
                    dataSource={data}
                    fetchData={fetchData}
                    sorted={sorted}
                    headerComponent={() => {
                        return (
                            <Flex gap={4} className="mb-4! w-full flex-col sm:flex-row">
                                <InputSearch handleChange={handleSearch} defaultValue={keyword} />
                                <Flex gap={4} className="w-full flex-wrap justify-end">
                                    <PDFDownloadLink
                                        document={
                                            <EmployeeReport
                                                employee_data={data}
                                                period={
                                                    props.period !== null
                                                        ? dayjs(props.period).locale('id').format('MMMM YYYY')
                                                        : dayjs().format('YYYY')
                                                }
                                            />
                                        }
                                        fileName={`monthly-report-${dayjs(props.period || undefined).format('MMMM-YYYY')}.pdf`}
                                    >
                                        {({ loading }) => (
                                            <Button type="primary" className="bg-[#FF6A0020]! text-[#FF6A00]!">
                                                {loading ? 'Loading...' : 'Export Pdf'}
                                                <DownloadOutlined />
                                            </Button>
                                        )}
                                    </PDFDownloadLink>

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
                            title: 'Date',
                            dataIndex: 'date',
                            key: 'date',
                            isSortable: true,
                            width: 120,
                            render(v) {
                                return new Date(v).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: '2-digit' });
                            },
                        },
                        {
                            title: 'Meal Total',
                            dataIndex: 'meal_total',
                            key: 'meal-total',
                            isSortable: true,
                            width: 150,
                            render: (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v),
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
                    ]}
                />
            </div>
        </AppLayout>
    );
}
