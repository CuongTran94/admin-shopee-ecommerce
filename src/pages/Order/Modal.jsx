import { Modal } from 'antd';

const ModalDelete = (action) => {
  return Modal.confirm({
    title: `Are you sure you want to delete the item`,
    content: 'Once deleted, the data cannot be recovered',
    okText: 'OK',
    cancelText: 'Cancel',
    onOk: action,
  });
};
export default ModalDelete;
