import React from 'react';
import { Modal } from 'antd';
import CreateProductForm from '../CreateForm';

const UpdateProductForm = props => {
    const {
        onCancel: handleUpdateModalVisible,
        updateModalVisible,
        values
    } = props;

    return (
        <Modal
            width={1200}
            bodyStyle={{
                padding: '32px 40px 48px',
            }}
            destroyOnClose
            title="Edit Product"
            visible={updateModalVisible}
            footer={null}
            onCancel={() => handleUpdateModalVisible()}
        >
            <CreateProductForm edit={true} values={values} />
        </Modal>
    );
};

export default UpdateProductForm;
