import { names } from '@/lib/utils';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Form, FormInstance, InputNumber, Modal, Select, Switch } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useMemo, useState } from 'react';
import { Label } from './label';
import { Meal } from './meal';

interface IVendorModalProps {
    setIsModalOpen: (status: boolean) => void;
    isModalOpen: boolean;
    date: string;
    form: FormInstance;
    divisions: Array<{ value: string; label: string }>;
    submitVendor: () => void;
}

export function VendorModal(props: IVendorModalProps) {
    const { setIsModalOpen, date, isModalOpen, form, divisions, submitVendor } = props;
    const [type, setType] = useState<string>('vendor');
    const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);

    const handleSearchEmployee = (text: string) => {
        debounceEmployee(text);
    };

    const debounceEmployee = useMemo(
        () =>
            debounce((text) => {
                fetch(route(names.employees.list, { keyword: text }))
                    .then((res) => res.json())
                    .then((data) => {
                        setOptions(data.length === 0 ? [{ value: 0, label: text }] : data);
                    });
            }, 1000),
        [],
    );

    return (
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
                        {`Assign Vendor - ${dayjs(date).format('DD MMMM YYYY')}`}
                    </Flex>
                    <Divider className="m-0!" />
                </div>
            }
            open={isModalOpen}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            closable={false}
            okText="Save"
            onCancel={() => setIsModalOpen(false)}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" noStyle />
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
                    <Form.Item name="employee_id" className="w-full" rules={[{ required: true, message: 'Employee required' }]}>
                        <Select
                            placeholder="Employee"
                            filterOption={false}
                            onSelect={(v, op) => form.setFieldValue('name', op.label)}
                            showSearch
                            options={options}
                            onSearch={handleSearchEmployee}
                        />
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
}
