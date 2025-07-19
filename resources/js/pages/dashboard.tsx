import { TinyAreaChart } from '@/components/mini-chart';
import { SimpleTable } from '@/components/simple-table';
import { TrendChart } from '@/components/trend-chart';
import AppLayout from '@/layouts/app-layout';
import { useAppContext } from '@/layouts/app-provider';
import { MonthlyReport } from '@/reports/monthly';
import { IDashboardProps, TMeal, TMealSaveMini } from '@/types/dashboard';
import { ArrowDownOutlined, ArrowUpOutlined, DownloadOutlined } from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, Card, Col, DatePicker, Divider, Flex, Row, Segmented } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/id';
import { capitalize, lowerCase } from 'lodash';
import { Fragment, useState } from 'react';

export default function Dashboard(props: IDashboardProps) {
    const { isMobile } = useAppContext();
    const [type, setType] = useState<TMealSaveMini>('meal');

    const handleChangePeriod = (value?: Dayjs) => {
        const period = value !== null ? dayjs(value).format('YYYY-MM') : null;
        router.reload({ data: { period } });
    };

    return (
        <AppLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className={`flex flex-col ${isMobile ? 'p-4' : 'p-8'}`}>
                <div className="flex-end mb-4 flex justify-end gap-2">
                    <PDFDownloadLink
                        document={
                            <MonthlyReport
                                meal={props.meal}
                                save={props.save}
                                claim={props.claim}
                                division_data={props.division_data}
                                period={props.period !== null ? dayjs(props.period).locale('id').format('MMMM YYYY') : dayjs().format('YYYY')}
                            />
                        }
                        fileName={`monthly-report-${dayjs(props.period || undefined)
                            .locale('id')
                            .format('MMMM-YYYY')}.pdf`}
                    >
                        {({ loading }) => (
                            <Button type="primary" className="bg-[#FF6A0020]! text-[#FF6A00]!">
                                {loading ? 'Loading...' : 'Export Pdf'}
                                <DownloadOutlined />
                            </Button>
                        )}
                    </PDFDownloadLink>

                    <DatePicker
                        picker="month"
                        allowClear={false}
                        onChange={handleChangePeriod}
                        defaultValue={props.period ? dayjs(props.period) : null}
                    />
                </div>
                <TrendChart trend={props.trend} />
                <Flex gap={20} className="flex-col lg:flex-row">
                    {[
                        {
                            title: 'Meal Total',
                            key: 'meal' as const,
                        },
                        {
                            title: 'Claim Total',
                            key: 'claim' as const,
                        },
                        {
                            title: 'Save Total',
                            key: 'save' as const,
                        },
                    ].map((part, _idx) => (
                        <Card className="w-full shadow-sm" key={_idx}>
                            <div className="flex">
                                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{part.title}</h3>
                                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }} className="ms-auto">
                                    {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                                        props?.[part.key].breakfast.total + props?.[part.key].lunch.total + props?.[part.key].dinner.total,
                                    )}
                                </h3>
                            </div>
                            {(['breakfast', 'lunch', 'dinner'] as TMeal[]).map((item, idx) => (
                                <Fragment key={idx}>
                                    <Row key={idx} style={{ fontWeight: 600, fontSize: 16 }}>
                                        <Col span={6}>{capitalize(item)}</Col>
                                        <Col span={8} className="text-right">
                                            {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                                                props?.[part.key][item as TMeal].total,
                                            )}
                                            {props?.[part.key][item as TMeal].trend === 'up' ? (
                                                <ArrowUpOutlined style={{ color: 'green', marginLeft: 5 }} />
                                            ) : (
                                                <ArrowDownOutlined style={{ color: 'red', marginLeft: 5 }} />
                                            )}
                                        </Col>
                                        <Col span={10} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <TinyAreaChart key={idx} data={props?.[part.key][item as TMeal].data} />
                                        </Col>
                                    </Row>
                                    {idx !== 2 && <Divider style={{ margin: 6 }} />}
                                </Fragment>
                            ))}
                        </Card>
                    ))}
                </Flex>
                <div style={{ marginTop: 20 }}>
                    <Segmented
                        style={{ marginBottom: 20 }}
                        options={['Meal', 'Claim', 'Save']}
                        onChange={(v) => setType(lowerCase(v).replace(' ', '') as TMealSaveMini)}
                    />

                    <SimpleTable
                        isPadding={false}
                        dataSource={props.division_data}
                        columns={[
                            {
                                dataIndex: 'key',
                                title: 'No',
                                key: 'no',
                                width: '8%',
                                render: (_, __, index) => index + 1,
                            },
                            {
                                dataIndex: 'name',
                                title: 'Division',
                                key: 'name',
                                width: '10%',
                            },
                            {
                                dataIndex: `breakfast_${type}`,
                                title: 'Breakfast',
                                key: 'breakfast',
                                align: 'right',
                                width: '30%',
                                render: (v) => Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v),
                            },
                            {
                                dataIndex: `lunch_${type}`,
                                title: 'Lunch',
                                key: 'lunch',
                                align: 'right',
                                width: '30%',
                                render: (v) => Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v),
                            },
                            {
                                dataIndex: `dinner_${type}`,
                                title: 'Dinner',
                                key: 'dinner',
                                align: 'right',
                                width: '30%',
                                render: (v) => Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v),
                            },
                        ]}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
