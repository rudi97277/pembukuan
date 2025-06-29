import { useAppContext } from '@/layouts/app-provider';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface ITinyAreaChartProps {
    data: Array<number>;
}
export function TinyAreaChart(props: ITinyAreaChartProps) {
    const { isMobile } = useAppContext();
    const { data: oldData } = props;
    const data = oldData.length < 2 ? [...Array(10).fill(0), ...oldData] : oldData;
    const trend = data[data.length - 1] >= data[0] ? 'up' : 'down';
    const chartData = data.map((value, idx) => ({ uv: value }));
    return (
        <div style={{ width: isMobile ? 90 : 120, height: 35 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <defs>
                        <linearGradient id="areaGreenGradient" x1="0" y1="0" x2="0" y2="1.5">
                            <stop offset="0%" stopColor="#49A677" />
                            <stop offset="97.34%" stopColor="rgba(255, 255, 255, 0)" />
                        </linearGradient>
                    </defs>
                    <defs>
                        <linearGradient id="areaPinkGradient" x1="0" y1="0" x2="0" y2="1.5">
                            <stop offset="4.06%" stopColor="#EB94A2" />
                            <stop offset="97.64%" stopColor="rgba(235, 148, 162, 0)" />
                        </linearGradient>
                    </defs>

                    <Area
                        dataKey="uv"
                        activeDot={false}
                        dot={false}
                        stroke={trend === 'up' ? '#5DB48A' : '#EB7487'}
                        fill={trend === 'up' ? 'url(#areaGreenGradient)' : 'url(#areaPinkGradient)'}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
