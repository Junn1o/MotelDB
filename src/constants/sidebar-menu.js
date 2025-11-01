import ProductIcon from '../assets/icons/product.svg';
import UserIcon from '../assets/icons/user.svg';

const sidebar_menu = [
    {
        id: 1,
        icon: UserIcon,
        path: '/users',
        title: 'Nguời dùng',
    },
    {
        id: 2,
        icon: ProductIcon,
        path: '/post',
        title: 'Tin',
    },
    {
        id: 3,
        icon: UserIcon,
        path: '/tier',
        title: 'Gói',
    },
    {
        id: 4,
        icon: UserIcon,
        path: '/role',
        title: 'Vai trò',
    },
]

export default sidebar_menu;