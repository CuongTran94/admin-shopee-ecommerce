import React from 'react';
import { Modal } from 'antd';

const UpdateForm = props => {

  const {
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
  } = props;

  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="Edit Category"
      visible={updateModalVisible}
      footer={null}
      onCancel={() => handleUpdateModalVisible()}
    >
      {props.children}
    </Modal>
  );
};

export default UpdateForm;
