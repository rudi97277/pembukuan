import { Link } from '@inertiajs/react';
import { JSX } from 'react';

interface MenuItemProps {
    title: string;
    href: string;
}
export default function MenuItem(props: MenuItemProps): JSX.Element {
    return (
        <Link preserveState href={props.href} preserveScroll>
            {props.title}
        </Link>
    );
}
