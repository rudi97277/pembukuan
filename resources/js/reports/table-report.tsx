import { StyleSheet, Text, View } from '@react-pdf/renderer';

interface ITableReportProps<T> {
    data: Array<T>;
    columns: Array<{
        key: string;
        title: string;
        type?: 'string' | 'number';
        dataIndex: keyof T;
        render?: (item: T, idx: number) => React.ReactNode;
    }>;
}

export function TableReport<T>(props: ITableReportProps<T>) {
    const { data, columns } = props;
    const styles = StyleSheet.create({
        table: {
            borderRadius: 10,
            width: '100%',
            border: '1px solid #eee',
        },
        row: {
            flexDirection: 'row',
            borderBottom: '1px solid #eee',
        },
        header: {
            backgroundColor: '#f3f4f6',
            fontWeight: 'bold',
        },
        cell: {
            width: `${100 / props.columns.length}%`,
            padding: 8,
            fontSize: 12,
        },
    });

    const getValue = (item: T, dataIndex: keyof T): string => (typeof item === 'object' && item !== null ? (item[dataIndex] as string) : '');

    return (
        <View style={[styles.table]}>
            <View style={[styles.row, styles.header, { borderTopLeftRadius: 10, borderTopRightRadius: 10, fontSize: 12 }]}>
                {columns.map((col, index) => (
                    <Text key={`${col.key}${index}`} style={styles.cell}>
                        {col.title}
                    </Text>
                ))}
            </View>

            {data.map((item, idx) => {
                return (
                    <View key={idx} style={styles.row}>
                        {columns.map((col, index) => (
                            <Text key={`${col.key}${index}`} style={styles.cell}>
                                {col.type === 'number'
                                    ? Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
                                          Number(getValue(item, col.dataIndex)),
                                      )
                                    : getValue(item, col.dataIndex)}
                            </Text>
                        ))}
                    </View>
                );
            })}
        </View>
    );
}
