import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

interface IInputSearchProps {
    defaultValue?: string;
    handleChange: (value: string) => void;
}
export function InputSearch(props: IInputSearchProps) {
    return (
        <Input
            placeholder="Search"
            defaultValue={props.defaultValue}
            onChange={(e) => props.handleChange(e.target.value)}
            prefix={<SearchOutlined />}
            className="max-w-[23rem]"
        />
    );
}
