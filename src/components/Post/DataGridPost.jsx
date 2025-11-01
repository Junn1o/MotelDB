import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { deletePost, getPostData } from '../../api/api';
import Button from '@mui/material/Button';
import EditDialog from '../../components/Post/EditPost_Dialog'
import ApprovePost from '../../components/Post/ApprovePost';
import ConfirmationModal from '../../components/Users/ConfirmationModal'
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
export default function DataGridPost() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState();
    const [totalPage, setTotalPage] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [openApproveDialog, setopenApproveDialog] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [selectedDataApprove, setselectedDataApprove] = useState(null);
    const [showMoreStates, setShowMoreStates] = useState({});
    const [sortby, setSortBy] = useState('dateCreated');
    const [isAscending, setisAscending] = useState(null);
    const [hireState, setHireState] = useState(null);
    const [statusState, setstatusState] = useState('Đang Chờ Duyệt');
    const [minPrice, setminPrice] = useState(null);
    const [maxPrice, setmaxPrice] = useState(null);
    const [minArea, setminArea] = useState(null);
    const [maxArea, setmaxArea] = useState(null);
    const [category, setcategory] = useState(null);
    const [isVip, setisVip] = useState(null);
    const [phoneNumb, setphoneNumb] = useState(null);
    const [address, setaddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isApply, setisApply] = useState(false);
    const [typeSearch, settypeSearch] = useState(null);
    const toggleShowMore = (rowId) => {
        setShowMoreStates((prevShowMoreStates) => ({
            ...prevShowMoreStates,
            [rowId]: !prevShowMoreStates[rowId],
        }));
    };
    const handleFirstPage = () => {
        setPage(1);
        loadData(hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize);
    };
    const handleLastPage = () => {
        setPage(totalPage);
        loadData(hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize);
    };
    const handlePageSizeChange = (newPageSize) => {
        if (newPageSize >= 1) {
            setPageSize(newPageSize);
            setPage(1);
            loadData(hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, phoneNumb, address, sortby, isAscending, 1, newPageSize);
        }
    };
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPage) {
            setPage(newPage);
            loadData(hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, phoneNumb, address, sortby, isAscending, newPage, pageSize);
        }
    };

    const loadData = async (hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize) => {
        await setLoading(true);
        setTimeout(() => {
            getPostData(hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize)
                .then(apiData => {
                    setData(apiData.data.post);
                    setTotalCount(apiData.data.total);
                    setTotalPage(apiData.data.totalPages);
                    console.log(apiData);
                }); setLoading(false);
        }, 3000)

    }
    useEffect(() => {
        loadData(hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize);
    }, []);

    const pageNumbers = Array.from({ length: totalPage }, (_, index) => index + 1);
    const handleEditDialog = (rowData) => {
        setSelectedRowData(rowData);
        setOpenDialog(true);
    };
    const handleApproveDialog = (rowData) => {
        setselectedDataApprove(rowData);
        setopenApproveDialog(true);
    };
    const handleDelete = (id) => {
        toast.info(
            <ConfirmationModal
                handleDeleteConfirmed={() => handleDeleteConfirmed(id)}
                hideToast={hideToast}
            />,
            {
                position: 'top-right',
                autoClose: true,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            }
        );
    };
    const hideToast = () => {
        toast.dismiss();
    };
    const handleDeleteConfirmed = async (id) => {
        try {
            await deletePost(id);
            toast.success('Xóa dữ liệu thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
            });
        } catch (error) {
            toast.error('Xóa dữ liệu không thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
            });
        }
    };

    const handleCloseDialog = () => {
        loadData(hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize);
        setselectedDataApprove(null);
        setOpenDialog(false);
        setopenApproveDialog(false)
    };
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50,
        },
        {
            field: 'title',
            headerName: 'Tiêu Đề',
            width: 150,
        },
        {
            field: 'phone',
            headerName: 'SĐT',
            width: 100,
        },
        {
            field: 'description',
            headerName: 'Mô Tả',
            width: 150,
            renderCell: (params) => {
                const content = params.value;
                const characterLimit = 70;
                const rowId = params.id;

                if (content && content.length > characterLimit) {
                    return (
                        <div>
                            {showMoreStates[rowId]
                                ? content
                                : content.slice(0, characterLimit) + '...'}
                            <button onClick={() => toggleShowMore(rowId)} className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-700">
                                {showMoreStates[rowId] ? 'Hiển Thị Ít Lại' : 'Hiển Thị Đầy Đủ'}
                            </button>
                        </div>
                    );
                }

                return content;
            },
        },
        {
            field: 'address',
            headerName: 'Địa Chỉ',
            width: 150,
        },
        {
            field: 'area',
            headerName: 'Diện Tích',
            width: 60,
            renderCell: (params) => (
                params.value + " m2"
            ),
        },
        {
            field: 'categorylist',
            headerName: 'Danh Mục',
            width: 130,
            renderCell: (params) => (
                params.value.join(', ')
            ),
        },
        {
            field: 'formattedDatecreated',
            headerName: 'Ngày Tạo',
            width: 92,
        },
        {
            field: 'formattedDateapprove',
            headerName: 'Ngày Duyệt',
            width: 92,
            renderCell: (params) => (
                params.value !== null ? params.value : 'Chưa có ngày duyệt'
            ),
        },
        {
            field: 'price',
            headerName: 'Giá',
            width: 100,
        },
        {
            field: 'status',
            headerName: 'Trạng Thái Duyệt',
            width: 100,
        },
        {
            field: 'isHire',
            headerName: 'Trạng Thái Thuê',
            width: 100,
        },
        {
            field: 'authorname',
            headerName: 'Chủ Trọ',
            width: 120,
        },
        {
            field: 'edit',
            headerName: 'Sửa',
            width: 65,
            sortable: false,
            renderCell: (params) => (
                <Button variant="contained" color="success" style={{ height: "40px" }} onClick={() => handleEditDialog(params.row)}>Sửa</Button>
            ),
            align: 'center',
        },
        {
            field: 'delete',
            headerName: 'Xoá',
            width: 65,
            sortable: false,
            renderCell: (params) => (
                <Button variant="outlined" color="error" style={{ height: "40px" }} onClick={() => handleDelete(params.row.id)}>Xoá</Button>
            ),
            align: 'center',
        },
        {
            field: 'approve',
            headerName: 'Duyệt',
            width: 65,
            renderCell: (params) => (
                <Button variant="outlined" color="primary" style={{ height: "40px" }} onClick={() => handleApproveDialog(params.row)}>
                    Duyệt
                </Button>
            ),
            align: 'center',
        },
    ];
    const statusOptions = [
        'Đã Duyệt', 'Không Chấp Nhận Duyệt', 'Đang Chờ Duyệt', 'Đã Ẩn'
    ];
    const isHireOptions = [
        'Chưa Được Thuê', 'Đã Được Thuê'
    ];
    const searchTypeOptions = [
        'Theo Địa Chỉ', 'Theo Số Điện Thoại'
    ];
    const handlestatusChange = (event, newValue) => {
        setstatusState(newValue);
        console.log(statusState);
        setisApply(true);
    };
    const handleisHireChange = (event, newValue) => {
        setHireState(newValue);
        console.log(newValue);
        setisApply(true);
    };
    const handleTypeSearch = (event, newValue) => {
        setstatusState(null);
        setSortBy(null);
        setisAscending(null);
        settypeSearch(newValue);
        setisApply(true);
    }
    const handlesearchText = (e) => {
        setphoneNumb(e.target.value);
        setaddress(e.target.value);
        setisApply(true);
    }
    const handlSearch = () => {
        if (typeSearch === 'Theo Địa Chỉ') {
            setphoneNumb(null);
            loadData(hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, null, address, sortby, isAscending, page, pageSize);
        }
        if (typeSearch === 'Theo Số Điện Thoại')
        {
            setaddress(null);
            loadData(hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, phoneNumb, null, sortby, isAscending, page, pageSize);
        }
        else{
            if(statusState === null){
                loadData(hireState, null, minPrice, maxPrice, minArea, maxArea, category, isVip, null, null, sortby, isAscending, page, pageSize);
            }
            if (hireState === null){
                loadData(null, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, null, null, sortby, isAscending, page, pageSize);
            }
            else{
                loadData(hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, null, null, sortby, isAscending, page, pageSize);
            }
        }
    }
    const handlereset = () => {
        setaddress(null)
        setphoneNumb(null);
        settypeSearch(null);
        setHireState(null);
        setstatusState('Đang Chờ Duyệt');
        setisApply(false);
        loadData(hireState, statusState, minPrice, maxPrice, minArea, maxArea, category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize);
    }
    return (
        <div style={{ width: '100%', margin: 'auto' }}>
            <DataGrid
                rows={data || []}
                getRowHeight={() => 'auto'}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
                columns={columns}
                hideFooterPagination={true}
                slots={{
                    toolbar: () => <CustomToolbar data={data} columns={columns} />,

                }}
                loading={loading}
            />
            <div className="w-full flex justify-end mt-4 space-x-4">
                <Button variant="contained" color="primary" onClick={() => handleFirstPage()} disabled={page === 1}>
                    Trang Đầu
                </Button>
                {pageNumbers.map((pageNumber) => (
                    <Button
                        variant="outlined"
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={pageNumber === page ? 'active' : ''}
                        disabled={pageNumber === page}
                    >
                        {pageNumber}
                    </Button>
                ))}
                <Button variant="outlined" color="secondary" onClick={() => handleLastPage()} disabled={page === totalPage}>
                    Trang Cuối
                </Button>
                <select onChange={(e) => handlePageSizeChange(parseInt(e.target.value))} value={pageSize}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            {selectedRowData && (
                <EditDialog
                    open={openDialog}
                    handleClose={handleCloseDialog}
                    rowData={selectedRowData}
                />
            )}
            {selectedDataApprove && (
                <ApprovePost
                    open={openApproveDialog}
                    handleClose={handleCloseDialog}
                    rowData={selectedDataApprove}
                />
            )}
            <div className="flex items-center space-x-4 mt-4">
                <div className="w-1/4">
                    <TextField
                        label="Ô tìm kiếm"
                        id="standard-basic"
                        //   value={searchQuery}
                        onChange={handlesearchText}
                    />
                </div>
                <div className="w-1/4">
                    Tìm theo
                </div>
                <div className="w-1/4">
                    <Autocomplete
                        options={searchTypeOptions}
                        getOptionLabel={(option) => option}
                        //value={typeSearch}
                        onChange={handleTypeSearch}
                        renderInput={(searchTypeOptions) => (
                            <TextField {...searchTypeOptions} label="Loại tìm kiếm" inputProps={{
                                ...searchTypeOptions.inputProps,
                                readOnly: true,
                            }} />

                        )}
                    />
                </div>
                <div className="w-1/4">
                    <Autocomplete
                        options={statusOptions}
                        getOptionLabel={(option) => option}
                        //   value={selectedStatus}
                        onChange={handlestatusChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Trạng thái duyệt" inputProps={{
                                ...params.inputProps,
                                readOnly: true,
                            }} />
                        )}
                    />
                </div>
                <div className="w-1/4">
                    <Autocomplete
                        options={isHireOptions}
                        getOptionLabel={(option) => option}
                        //   value={selectedCategory}
                        onChange={handleisHireChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Trạng thái thuê" inputProps={{
                                ...params.inputProps,
                                readOnly: true,
                            }} />
                        )}
                    />
                </div>
                <div className="w-1/4">
                    <Button variant="contained" color="primary" disabled={isApply === false} onClick={() => handlSearch()}>
                        Tìm Kiếm
                    </Button>
                </div>
                <div className="w-1/4">
                    <Button variant="contained" color="primary" disabled={isApply === false} onClick={()=> handlereset()}>
                        Reset Trạng Thái
                    </Button>
                </div>
            </div>
        </div>

    )
}
function CustomToolbar({ columns, data, handlenotHire, handleStatus }) {
    const exportToCsv = () => {
        const excludedColumns = ['actualFile', 'edit', 'delete', 'approve'];
        const exportColumns = columns.filter((column) => !excludedColumns.includes(column.field));
        const header = exportColumns.map((column) => column.headerName).join(',');
        const csv = [header];

        data.forEach((row) => {
            const rowData = exportColumns
                .map((column) => {
                    let cellValue = row[column.field];

                    // If the value is an array, join its elements with a delimiter (e.g., a comma)
                    if (Array.isArray(cellValue)) {
                        cellValue = cellValue.join(', ');
                    }

                    // Check if the cell value is a string containing a comma or a line break
                    if (typeof cellValue === 'string' && (cellValue.includes(',') || cellValue.includes('\n'))) {
                        cellValue = `"${cellValue.replace(/"/g, '""')}"`; // Escape double quotes
                    }

                    return cellValue;
                })
                .join(',');

            csv.push(rowData);
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'data.csv');
        link.click();
    };
    return (
        <GridToolbarContainer>
            <Button variant="outlined" color="primary" onClick={exportToCsv}>
                Tải Xuống
            </Button>
        </GridToolbarContainer>
    );
}

