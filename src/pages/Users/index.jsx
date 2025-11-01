import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import { toast } from 'react-toastify';
import '../styles.css';
import { getUsers, getTiers, getRoles, updateUser, deleteUser } from '../../api/api';
import ConfirmationModal from '../../components/Users/ConfirmationModal'
import UserList from '../../components/Users/UserList'
import UserForm from '../../components/Users/UserForm'
import Pagination from '../../components/Users/Pagination'
import Button from '@mui/material/Button';
import { CSVLink } from 'react-csv';
import { TextField } from '@mui/material';


function Users() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const [totalUsers, settotalUsers] = useState(0);
    const [isApply, setisApply] = useState(false);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [roles, setRoles] = useState([]);
    const [tiers, setTiers] = useState([]);
    const [filterOn, setFilterOn] = useState(null);
    const [filterQuery, setFilterQuery] = useState(null);
    const [DataExport, setDataExport] = useState([]);
    const handleEdit = (user) => {
        setEditingUser(user);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditingUser(null);
        setIsEditing(false);
    };
    const handleSave = async (event) => {
        event.preventDefault();
        try {
            await updateUser({
                ...editingUser,
                gender: editingUser.gender === 'true',
            });
            
            toast.success('Thông tin đã được cập nhật', {
                position: 'top-right',
                autoClose: 3000, // Đóng thông báo sau 3 giây
                hideProgressBar: false,

            });
            setIsEditing(false);
            const updatedUsers = users.map((user) =>
                user.id === editingUser.id ? editingUser : user
            );
            setUsers(updatedUsers);
        } catch (error) {
            toast.error('Lỗi không sửa được người dùng', {
                position: 'top-right',
                autoClose: 3000, // Đóng thông báo sau 3 giây
                hideProgressBar: false,
            });
        }
    };
    const fetchData = async (currentPage, filterOn, filterQuery) => {
        const userResponse = await getUsers(currentPage, filterOn, filterQuery)
        setUsers(userResponse.data.users);
        console.log(userResponse);
        setTotalPages(userResponse.data.totalPages);

        const tierResponse = await getTiers(currentPage);
        setTiers(tierResponse.data.tiers);
        // setTotalPages(tierResponse.data.totalPages);
        const roleResponse = await getRoles();
        setRoles(roleResponse.data)
    };
    const [ByPhone, setByPhone] = useState(false);
    const [ByName, setByName] = useState(false);



    useEffect(() => {
        fetchData(currentPage, filterOn, filterQuery);
    }, [currentPage, filterOn, filterQuery]);
    const handleDelete = (userId) => {
        // Hiển thị toast để xác nhận trước khi xóa
        toast.info(
            <ConfirmationModal
            handleDeleteConfirmed={() => handleDeleteConfirmed(userId)}
            hideToast={hideToast}
        />,
        {
            position: 'top-right',
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
             // Đóng toast khi nó được đóng
        }
        );
    };

    const handleDeleteConfirmed = async (userId) => {
        // Gửi yêu cầu xóa đến API
        try {
            await deleteUser(userId);
            const updatedUsers = users.filter((user) => user.id !== userId);
            setUsers(updatedUsers);
            toast.info(
                <ConfirmationModal
                hideToast={hideToast}
            />,
            {
                position: 'top-right',
                autoClose: false,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: hideToast
            }
            );
            toast.success('Xóa dữ liệu thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
            });
            
        } catch (error) {
            toast.info(
                <ConfirmationModal
                hideToast={hideToast}
            />,
            {
                position: 'top-right',
                autoClose: false,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: hideToast
            }
            );
            toast.error('Xóa dữ liệu không thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
            });
        }
    };
    const hideToast = () => {
        // Ẩn toast nếu người dùng hủy bỏ
        toast.dismiss();
    };
    // const __handleSearch = (event) => {
    //     const searchTerm = event.target.value;
    //     setSearch(searchTerm);

    //     if (searchTerm !== '') {
    //         // Gọi API filter từ phía backend
    //         axios.get(`https://localhost:7139/api/User/get-all-users?pageNumber=${currentPage}&pageSize=5&filterOn=firstname&filterQuery=${searchTerm}`)
    //             .then((response) => {
    //                 const userData = response.data.users;
    //                 setUsers(userData);
    //                 setTotalPages(response.data.totalPages);
    //                 setCurrentPage(1); // Reset current page to 1 when search results change
    //             })
    //             .catch((error) => {
    //                 console.error(error);
    //             });
    //     } else {
    //         fetchData();
    //     }
    // };

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1)
    }
    const getUsersExport = async (event, done) => {
        let results = [];

        try {
            if (users && users.length > 0) {
                results.push(["ID", "Tên", "Họ", "Ngày Sinh", "Địa chỉ", "Giới tính", "Số điện thoại", "Vai Trò", "Gói sử dụng"]);
                users.forEach((user) => {
                    let arr = [];
                    arr[0] = user.id;
                    arr[1] = user.firstname;
                    arr[2] = user.lastname;
                    arr[3] = user.birthday;
                    arr[4] = user.address;
                    arr[5] = user.gender ? 'Nam' : 'Nữ';
                    arr[6] = user.phone;
                    arr[7] = user.rolename;
                    arr[8] = user.tier;
                    results.push(arr);
                });

                setDataExport(results);
                done();
            }
        } catch (error) {
            console.error("Error exporting CSV:", error);
            done();
        }
    };
    const handleByPhoneChange = () => {
        setByPhone(!ByPhone);
        if (ByName) {
            setByName(false);
        }
        setFilterOn('phone');
        setisApply(true);
    };
    const handlesearchText = (e) => {
        setFilterQuery(e.target.value);
        console.log(filterQuery);
        setisApply(true);
    }

    const handleByNameChange = () => {
        setByName(!ByName);
        if (ByPhone) {
            setByPhone(false);
        }
        setFilterOn('firstname');
        setisApply(true);
    };
    const handlSearch = () => {
        if(filterQuery!=null){
            fetchData(currentPage, filterOn, filterQuery);
        }
    }
    const handlereset = () => {
        setisApply(false);
        setFilterOn(null);
        setFilterQuery(null);
    }

    return (
        <div className='dashboard-content'>
            <DashboardHeader  />

            <div className='dashboard-content-container  relative'>

                <div className='dashboard-content-header'>
                    <h2 className='text-black'>Danh Sách Người Dùng</h2>
                    
                    <div className='dashboard-content-search'>
                    <CSVLink
                        data={DataExport}
                        filename={"users.csv"}
                        className="btn bg-green-400 "
                        asyncOnClick={true}
                        onClick={getUsersExport}
                    >
                        <i class="fa-solid fa-download"></i> Tải xuống
                    </CSVLink>
                    </div>

                </div>

                <UserList users={users} handleEdit={handleEdit} handleDelete={handleDelete} />
                {isEditing && (
                    <UserForm
                        editingUser={editingUser}
                        isEditing={isEditing}
                        setEditingUser={setEditingUser}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                        roles={roles}
                        tiers={tiers}
                    />
                )}
                <Pagination totalPages={totalPages} handlePageClick={handlePageClick} />
                <div className="flex items-center space-x-4 mt-4">
                    <TextField
                        label="Ô tìm kiếm"
                        id="standard-basic"
                        variant="standard"
                        onChange={handlesearchText}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={ByPhone}
                            onChange={handleByPhoneChange}
                        />
                        Theo SĐT
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={ByName}
                            onChange={handleByNameChange}
                        />
                        Theo Tên
                    </label>
                    <div className="w-1/4">
                        <Button variant="contained" color="primary" disabled={isApply === false} onClick={() => handlSearch()}>
                            Tìm Kiếm
                        </Button>
                        <Button variant="contained" color="primary" disabled={isApply === false} onClick={() => handlereset()}>
                            Reset Trạng Thái
                        </Button>
                    </div>
                    <div className="w-1/4">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users;
