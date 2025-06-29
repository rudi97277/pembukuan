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
import { capitalize, lowerCase } from 'lodash';
import { Fragment, useState } from 'react';

export default function Dashboard(props: IDashboardProps) {
    const { meal, save } = props;
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
                                division_data={props.division_data}
                                period={props.period !== null ? dayjs(props.period).format('MMMM YYYY') : dayjs().format('YYYY')}
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

                    <DatePicker
                        picker="month"
                        allowClear={false}
                        onChange={handleChangePeriod}
                        defaultValue={props.period ? dayjs(props.period) : null}
                    />
                </div>
                <TrendChart trend={props.trend} />
                <Flex gap={20} className="flex-col lg:flex-row">
                    <Card className="w-full shadow-sm">
                        <div className="flex">
                            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Meal Total</h3>
                            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }} className="ms-auto">
                                {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                                    meal.breakfast.total + meal.lunch.total + meal.dinner.total,
                                )}
                            </h3>
                        </div>
                        {(['breakfast', 'lunch', 'dinner'] as TMeal[]).map((item, idx) => (
                            <Fragment key={idx}>
                                <Row key={idx} style={{ fontWeight: 600, fontSize: 16 }}>
                                    <Col span={6}>{capitalize(item)}</Col>
                                    <Col span={8} className="text-right">
                                        {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                                            meal[item as TMeal].total,
                                        )}
                                        {meal[item as TMeal].trend === 'up' ? (
                                            <ArrowUpOutlined style={{ color: 'green', marginLeft: 5 }} />
                                        ) : (
                                            <ArrowDownOutlined style={{ color: 'red', marginLeft: 5 }} />
                                        )}
                                    </Col>
                                    <Col span={10} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <TinyAreaChart key={idx} data={meal[item as TMeal].data} />
                                    </Col>
                                </Row>
                                {idx !== 2 && <Divider style={{ margin: 6 }} />}
                            </Fragment>
                        ))}
                    </Card>
                    <Card className="w-full shadow-sm">
                        <div className="flex">
                            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Save Total</h3>
                            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }} className="ms-auto">
                                {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                                    save.breakfast.total + save.lunch.total + save.dinner.total,
                                )}
                            </h3>
                        </div>
                        {(['breakfast', 'lunch', 'dinner'] as TMeal[]).map((item, idx) => (
                            <Fragment key={idx}>
                                <Row style={{ fontWeight: 600, fontSize: 16 }}>
                                    <Col key={idx} span={6}>
                                        {capitalize(item)}
                                    </Col>
                                    <Col span={8} className="text-right">
                                        {Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                                            save[item as TMeal].total,
                                        )}
                                        {save[item as TMeal].trend === 'up' ? (
                                            <ArrowUpOutlined style={{ color: 'green', marginLeft: 5 }} />
                                        ) : (
                                            <ArrowDownOutlined style={{ color: 'red', marginLeft: 5 }} />
                                        )}
                                    </Col>
                                    <Col span={10} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <TinyAreaChart data={save[item as TMeal].data} />
                                    </Col>
                                </Row>
                                {idx !== 2 && <Divider style={{ margin: 6 }} />}
                            </Fragment>
                        ))}
                    </Card>
                </Flex>
                <div style={{ marginTop: 20 }}>
                    <Segmented style={{ marginBottom: 20 }} options={['Meal', 'Save']} onChange={(v) => setType(lowerCase(v) as TMealSaveMini)} />
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
                            },
                            {
                                dataIndex: `breakfast_${type}`,
                                title: 'Breakfast',
                                key: 'breakfast',
                                align: 'right',
                                render: (v) => Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v),
                            },
                            {
                                dataIndex: `lunch_${type}`,
                                title: 'Lunch',
                                key: 'lunch',
                                align: 'right',
                                render: (v) => Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v),
                            },
                            {
                                dataIndex: `dinner_${type}`,
                                title: 'Dinner',
                                key: 'dinner',
                                align: 'right',
                                render: (v) => Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v),
                            },
                        ]}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
