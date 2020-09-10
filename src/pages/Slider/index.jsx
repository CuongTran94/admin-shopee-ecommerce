import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Select, Input, InputNumber, Upload, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { extend } from 'lodash';
import { useEffect } from 'react';

const Slider = (props) => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [image, setImage] = useState('');
  const { listSlider, dispatch } = props;

  useEffect(() => {
    dispatch({
      type: 'slider/fetch',
    });
  }, []);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Image is required',
          },
        ],
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <>
            {!image ? (
              <>
                <Upload beforeUpload={beforeUpload}>
                  {fileList.length < 1 && <Button icon={<UploadOutlined />}>Select File</Button>}
                </Upload>
                <Button
                  type="primary"
                  loading={uploading}
                  style={{ marginTop: 16 }}
                  onClick={handleUpload}
                >
                  {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: 200,
                    height: 100,
                    border: '1px solid #d9d9d9',
                    borderRadius: '3px',
                    padding: '8px',
                  }}
                >
                  <img src={image} alt="" style={{ width: '100%', height: '100%' }} />
                </div>
                <Button type="primary" loading={uploading} style={{ marginTop: 16 }} danger>
                  {uploading ? 'Removing' : 'Remove'}
                </Button>
              </>
            )}
          </>
        );
      },
      render: (val, entity) => <img src={val} alt={val} style={{ width: 200, height: 100 }} />,
    },
    {
      title: 'Link',
      dataIndex: 'link',
      name: 'link',
      valueType: 'text',
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return <Input {...rest} placeholder="#" />;
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      name: 'title',
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return <Input {...rest} placeholder="Title" />;
      },
    },
    {
      title: 'Order',
      dataIndex: 'order',
      name: 'order',
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return <InputNumber style={{ width: '100%' }} {...rest} min={0} />;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      name: 'status',
      hideInSearch: true,
      valueEnum: {
        false: {
          text: 'Hidden',
          status: 'Default',
        },
        true: {
          text: 'Show',
          status: 'Success',
        },
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <Select placeholder="Select status">
            <Select.Option value={false}>Hidden</Select.Option>
            <Select.Option value={true}>Show</Select.Option>
          </Select>
        );
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            size="small"
            shape="round"
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
              setImage(record.image);
            }}
          >
            Edit
          </Button>
          <Divider type="vertical" />
          <Button
            type="primary"
            size="small"
            shape="round"
            danger
            onClick={() => handleRemove(record)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const beforeUpload = (file) => {
    setFileList([file]);
  };

  const handleUpload = () => {
    setUploading(true);
    dispatch({
      type: 'slider/handleUpload',
      payload: fileList[0],
      callback: (res) => {
        if (res) {
          setImage(res);
          setFileList([]);
          setUploading(false);
        } else {
          setImage('');
          setUploading(false);
        }
      },
    });
  };

  const handleAdd = (fields) => {
    const params = extend(fields, {
      createdAt: new Date(),
      image: image,
    });

    dispatch({
      type: 'slider/handleAdd',
      payload: params,
      callback: () => {
        dispatch({
          type: 'slider/fetch',
        });
        setImage('');
        handleModalVisible(false);
      },
    });
  };

  const handleUpdate = (fields) => {
    if (!fields) return true;

    dispatch({
      type: 'slider/handleUpdate',
      payload: extend(fields, {
        id: stepFormValues.id,
        image: image,
        createdAt: new Date(),
      }),
      callback: () => {
        dispatch({
          type: 'slider/fetch',
        });
        setImage('');
        handleModalVisible(false);
        setStepFormValues({});
      },
    });
  };

  const handleRemove = (selectedRows) => {
    if (!selectedRows) return true;

    Modal.confirm({
      title: `Are you sure you want to delete the selected slider (${selectedRows.title})?`,
      content: 'Once deleted, the data cannot be recovered',
      okText: 'OK',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch({
          type: 'slider/handleDelete',
          payload: { id: selectedRows.id, url: selectedRows.image },
          callback: () => {
            dispatch({
              type: 'slider/fetch',
            });
          },
        });
      },
    });
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle="List Slider"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> Create Slider
          </Button>,
        ]}
        pagination={{
          defaultPageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        search={false}
        options={{
          fullScreen: false,
          density: false,
          reload: true,
          setting: false,
        }}
        dataSource={listSlider}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />

      <CreateForm
        onCancel={() => {
          handleModalVisible(false);
          setFileList([]);
          setImage('');
        }}
        modalVisible={createModalVisible}
      >
        <ProTable
          onSubmit={(value) => {
            handleAdd(value);
          }}
          search={{
            submitText: 'Submit',
            resetText: 'Reset',
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
            setImage('');
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        >
          <ProTable
            form={{
              layout: 'vertical',
              initialValues: {
                link: stepFormValues.link,
                title: stepFormValues.title,
                order: stepFormValues.order,
                status: stepFormValues.status,
              },
            }}
            onSubmit={(value) => handleUpdate(value)}
            search={{
              submitText: 'Save',
              resetText: 'Reset',
            }}
            rowKey="id"
            type="form"
            columns={columns}
            rowSelection={false}
          />
        </UpdateForm>
      ) : null}
    </PageContainer>
  );
};

export default connect(({ slider }) => ({
  listSlider: slider.listSlider,
}))(Slider);
