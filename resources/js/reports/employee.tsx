import { IReportEmployee } from "@/types/report-employee";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";
import 'dayjs/locale/id';
import { TableReport } from "./table-report";

interface IEmployeeReportProps {
    period: string;
    employee_data: Array<IReportEmployee>;
}

export function EmployeeReport(props: IEmployeeReportProps) {
    return (
        <Document>
            <Page size="A4" style={{ padding: 40 }}>
                <Text style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Beryl Farm — Employee Report</Text>
                <Text style={{ fontSize: 14, marginBottom: 10 }}>Period: {props.period}</Text>
                <Text style={{ fontSize: 14, marginBottom: 20 }}>Generated on: {dayjs().locale('id').format('D MMMM YYYY HH:mm:ss')}</Text>
                <View
                    style={{
                        height: 1,
                        backgroundColor: '#ccc',
                        marginBottom: 30,
                        width: '100%',
                    }}
                />

                <Text style={{ fontSize: 14, marginBottom: 10 }}>Employee Report</Text>
                <TableReport
                    withNumber
                    data={props.employee_data}
                    columns={[
                        {
                            title: 'Employee',
                            dataIndex: 'name',
                            key: 'name',
                        },
                        {
                            title: 'Division',
                            key: 'division',
                            dataIndex: 'division',
                        },
                        {
                            key: 'date',
                            title: 'Date',
                            dataIndex: 'date',
                            type: "date"
                        },
                        {
                            key: 'claim',
                            title: 'Claim total',
                            dataIndex: 'claim_total',
                            type: 'number'
                        },
                        {
                            key: 'save',
                            title: 'Save total',
                            dataIndex: 'save_total',
                            type: 'number'
                        },
                    ]}
                />


            </Page>
        </Document>
    )
}