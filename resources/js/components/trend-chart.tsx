import { ITrend } from '@/types/dashboard';
import { Card } from 'antd';
import { Fragment } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ActiveDotProps } from 'recharts/types/util/types';

interface ITrendChartProps {
    trend: ITrend;
}

export function TrendChart(props: ITrendChartProps) {
    const { graph: data, claim, meal } = props.trend;

    const CustomDotMeal = ({ cx, cy, key }: ActiveDotProps) => {
        return (
            <Fragment key={key}>
                <circle cx={cx} cy={cy} r={8} fill="rgba(108, 124, 246, 0.2)" stroke="none" />
                <circle cx={cx} cy={cy} r={4} fill="#6C7CF6" stroke="#fff" strokeWidth={2} />
            </Fragment>
        );
    };

    const CustomDotSave = ({ cx, cy, key }: ActiveDotProps) => {
        return (
            <Fragment key={key}>
                <circle cx={cx} cy={cy} r={8} fill="rgba(255, 106, 0, 0.2)" stroke="none" />
                <circle cx={cx} cy={cy} r={4} fill="#FF6A00" stroke="#fff" strokeWidth={2} />
            </Fragment>
        );
    };

    return (
        <Card className="mb-8!">
            <div style={{ marginBottom: 18, fontWeight: 600, fontSize: 18 }} className="flex justify-between">
                <h3>Total</h3>

                <div className="flex gap-2">
                    <h3 style={{ color: '#6C7CF6' }}>
                        [{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(meal)}]
                    </h3>
                    <h3 style={{ color: '#FF6A00' }}>
                        [{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(claim)}]
                    </h3>
                </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={500}
                        height={400}
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorMeal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(112, 134, 253, 0.3)" />
                                <stop offset="100%" stopColor="rgba(112, 134, 253, 0.05)" />
                            </linearGradient>
                        </defs>
                        <defs>
                            <linearGradient id="colorSave" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(255, 106, 0, 0.3)" />
                                <stop offset="100%" stopColor="rgba(255, 106, 0, 0.05)" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />

                        <Area type="monotone" dataKey="Meal" stroke="#8884d8" fill="url(#colorMeal)" dot={CustomDotMeal} />
                        <Area type="monotone" dataKey="Claim" stroke="#FF6A00" fill="url(#colorSave)" dot={CustomDotSave} />
                        <Legend verticalAlign="bottom" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
