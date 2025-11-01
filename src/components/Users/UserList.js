import React, { useState } from 'react';
import { image } from '../../constants/URL'
import { Link } from 'react-router-dom';
function UserList({ users, handleEdit, handleDelete }) {
    const [loadingapi, ___setLoadingAPI] = useState(true);
    const [_path, setPath] = useState(localStorage.getItem('path'));
    const handleDeletePath = () => {
        setPath(localStorage.removeItem('path'));
    };
    if (!users || users.length === 0) {
        return <div className="flex items-center justify-center">
            {loadingapi && <i className="fas fa-circle-notch fa-spin"></i>}
        </div>;
    }

    return (
        <table>
            <thead>

                <th>ID</th>
                <th>Tên</th>
                <th>Ngày Sinh</th>
                <th>Địa chỉ</th>
                <th>Giới tính</th>
                <th>Số Điện Thoại</th>
                <th>Vai trò</th>
                <th>Gói</th>
                <th>Xóa</th>
                <th>Sửa</th>
                <th>Chi tiết</th>
            </thead>
            <tbody>
                {users.length > 0 ? (users.map((user, index) => (
                    <tr key={index}>
                        <td><span>{user.id}</span></td>
                        <td>
                            <div>
                                {user.actualFile && (<img
                                    src={`${image}/${user.actualFile}`}
                                    className="dashboard-content-avatar "
                                    alt="not found"
                                />)}
                                <span>{user.firstname + " " + user.lastname}</span>
                            </div>
                        </td>
                        <td><span>{user.birthday}</span></td>
                        <td><span>{user.address}</span></td>
                        <td><span>{user.gender}</span></td>
                        <td><span>{user.phone}</span></td>
                        <td><span>{user.rolename}</span></td>
                        <td><span>{user.tier}</span></td>

                        <td>
                            <button className="bg-red-600" onClick={() => handleDelete(user.id)}>
                                Xóa
                            </button>
                        </td>
                        <td>
                            <button className="bg-yellow-400" onClick={() => handleEdit(user)}>
                                sửa
                            </button>
                        </td>
                        <td>
                            <Link to={`/users/${user.id}`} >
                                <button className="bg-gray-400 text-black" onClick={handleDeletePath}>
                                    Chi tiết
                                </button>
                            </Link>
                        </td>


                    </tr>
                ))):null}
            </tbody>
        </table>
    );
}

export default UserList;