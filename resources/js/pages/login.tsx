import { Button, Card, Form, Input } from 'antd';

export default function Login() {
    const [form] = Form.useForm();
    return (
        <div
            className="flex h-screen w-screen items-center justify-center"
            style={{ backgroundImage: 'url(images/login.jpg)', backgroundSize: 'cover' }}
        >
            <Card>
                <Form form={form} layout="vertical">
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}>
                        <Input placeholder="Email" style={{ fontSize: 15 }} />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}>
                        <Input.Password placeholder="Password" style={{ fontSize: 15 }} />
                    </Form.Item>
                    <Button className="w-full" htmlType="submit" type="primary">
                        Login
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
