import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { putApprovePost } from '../../api/api';

function ApprovePost({ open, handleClose, rowData }) {
    const { user } = useContext(UserContext);
    const [editedData, setEditedData] = useState(rowData);
    const [reasonField, setTextFieldValue] = useState('');
    const statusOption = [
        'Đã Duyệt', 'Không Chấp Nhận Duyệt', 'Đang Chờ Duyệt', 'Đã Ẩn'
    ];
    const handlestatusChange = (event, newValue) => {
        setEditedData({ ...editedData, status: newValue });
    };
    const handleReasonTextChange = (event) => {
        setTextFieldValue(event.target.value);
    };
    const handleSave = async () => {
        let date = new Date();
        let dateString = date.toISOString();
        const data = {
            userAdminId : user.userid,
            status : editedData.status,
            reason: reasonField,
            dateApproved : dateString,
        }
        console.log(data.userAdminId,data.status,data.reason, data.dateApproved)
        const response =  await putApprovePost(editedData.id, data);
          if(response){
            toast.success('Cập nhật thành công', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
          })}
          else{
            toast.error('Lỗi update không thành công vui lòng kiểm tra lại', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
          })}
          handleClose();
    };
    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="md">
            <DialogTitle className="bg-blue-500 text-white p-2">Duyệt Tin</DialogTitle>
            <DialogContent>
                {/* <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    label="Tiêu Đề"
                    fullWidth
                    value={editedData.title}
                    onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                />
                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    label="Địa Chỉ"
                    fullWidth
                    value={editedData.address}
                    onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                />
                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    label="Chủ Trọ"
                    fullWidth
                    value={editedData.authorname}
                    onChange={(e) => setEditedData({ ...editedData, authorname: e.target.value })}
                /> */}
                <div className="mb-4">
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={statusOption}
                    getOptionLabel={(option) => option}
                    value={editedData.status}
                    disableClearable={true}
                    className="mt-4"
                    onChange={handlestatusChange}
                    renderInput={(statusOption) => (<TextField {...statusOption} label="Trạng Thái Duyệt" inputProps={{
                        ...statusOption.inputProps,
                        readOnly: true,
                    }} />)}
                />
                </div>
                <div className="mb-4">
                {editedData.status === "Không Chấp Nhận Duyệt" && (
                    <TextField
                        label="Lý Do Không Duyệt"
                        fullWidth
                        multiline
                        rows={4}
                        value={editedData.reason}
                        onChange={handleReasonTextChange}
                    />
                )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Huỷ
                </Button>
                <Button onClick={handleSave} color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default ApprovePost;