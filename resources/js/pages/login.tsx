import { Label } from '@/components/label';
import { names } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';

interface ILoginProps {
    errors: { login?: string };
}
export default function Login(props: ILoginProps) {
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>(props.errors.login || '');

    const submitLogin = async () => {
        form.validateFields().then((values) => {
            router.post(route(names.login.action), values, { preserveState: false });
        });
    };

    return (
        <div
            className="flex h-screen w-screen flex-col items-center justify-center"
            style={{ backgroundImage: 'url(images/login.jpg)', backgroundSize: 'cover' }}
        >
            <div className="mb-8 text-center text-white">
                <h2 className="text-2xl font-bold">Welcome Back, Admin Beryl's</h2>
                <p>We are excited to have your back. Log in now and access your account.</p>
                <p className="text-red-400">{error}</p>
            </div>
            <Head title="Login" />
            <Form form={form} layout="vertical">
                <Form.Item
                    name="email"
                    label={<Label text="Email" className="text-white!" />}
                    required={false}
                    rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
                >
                    <Input
                        placeholder="Email"
                        onChange={() => error && setError(null)}
                        className="w-[80dvw]! bg-transparent! text-[16px] text-white! sm:w-[40dvw]!"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label={<Label text="Password" className="text-white!" />}
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input.Password
                        placeholder="Password"
                        onChange={() => error && setError(null)}
                        classNames={{}}
                        className="bg-transparent! text-[16px] text-white!"
                    />
                </Form.Item>
                <Button
                    style={{ background: 'linear-gradient(90.67deg, #F6B8FD -7.12%, #FF6A00 114.37%)' }}
                    className="w-full text-[18px]! font-bold! text-white!"
                    htmlType="submit"
                    type="primary"
                    onClick={submitLogin}
                >
                    Log In
                </Button>
            </Form>
        </div>
    );
}
