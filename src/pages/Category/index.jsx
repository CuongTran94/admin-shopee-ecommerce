import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Upload,
  Button,
  Divider,
  message,
  Input,
  InputNumber,
  Select,
  TreeSelect,
  Modal,
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect } from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import { extend } from 'lodash';
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const Category = (props) => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const { dispatch, listCate, loading } = props;
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const getCategoryByParent = (pId = 'root') => {
    const result = listCate.filter((item) => item.c_parentId === pId);

    let treeData = [];
    let count = 0;
    result.forEach((item) => {
      let category = {};

      category['title'] = item.c_name;
      category['value'] = item.id;
      category['children'] = getCategoryByParent(item.id);
      treeData[count++] = category;
    });
    return treeData;
  };

  useEffect(() => {
    dispatch({
      type: 'category/fetch',
    });
  }, []);

  const beforeUpload = (file) => {
    setFileList([file]);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'c_image',
      name: 'Image',
      hideInTable: true,
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <>
            {!image ? (
              <>
                <Upload beforeUpload={beforeUpload}>
                  {fileList.length < 1 && <Button icon={<UploadOutlined />}>Select File</Button>}
                </Upload>
                <Button
                  onClick={handleUpload}
                  type="primary"
                  loading={uploading}
                  style={{ marginTop: 16 }}
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
    },
    {
      title: 'Name',
      dataIndex: 'c_name',
      name: 'name',
      rules: [
        {
          required: true,
          message: 'Name is required',
        },
      ],
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return <Input {...rest} placeholder="Name" />;
      },
    },
    {
      title: 'Parent',
      dataIndex: 'c_parentId',
      name: 'parent',
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <TreeSelect
            treeData={getCategoryByParent()}
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
          ></TreeSelect>
        );
      },
      renderText: (val) => {
        const cate = listCate.find((item) => item.id === val);
        return cate ? cate.c_name : 'N/A';
      },
    },
    {
      title: 'Slug',
      dataIndex: 'c_slug',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: 'Order',
      dataIndex: 'c_order',
      name: 'order',
      hideInForm: false,
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return <InputNumber style={{ width: '100%' }} {...rest} min={0} />;
      },
    },
    {
      title: 'Description',
      dataIndex: 'c_description',
      name: 'description',
      hideInTable: true,
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <TextArea {...rest} placeholder="Description" autoSize={{ minRows: 2, maxRows: 6 }} />
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'c_status',
      name: 'status',
      hideInForm: false,
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
      dataIndex: 'createdAt',
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
              setImage(record.c_image);
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
            onClick={() => {
              handleRemove(record);
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleUpload = () => {
    setUploading(true);
    dispatch({
      type: 'category/handleUpload',
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
      type: 'category/handleSubmitCate',
      payload: params,
      callback: () => {
        dispatch({
          type: 'category/fetch',
        });
        setImage('');
      },
    });

    dispatch({
      type: 'category/fetch',
    });

    return true;
  };

  const handleUpdate = (fields) => {
    if (!fields) return true;

    dispatch({
      type: 'category/handleUpdateCate',
      payload: extend(fields, { id: stepFormValues.id }),
      callback: () => {
        dispatch({
          type: 'category/fetch',
        });
      },
    });
    return true;
  };

  const handleRemove = (selectedRows) => {
    if (!selectedRows) return true;
    const newPayload = {
      id: selectedRows.id,
      image: selectedRows.c_image,
    };
    Modal.confirm({
      title: `Are you sure you want to delete the selected category (${selectedRows.c_name})?`,
      content: 'Once deleted, the data cannot be recovered',
      okText: 'OK',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch({
          type: 'category/handleDelCate',
          payload: newPayload,
          callback: () => {
            dispatch({
              type: 'category/fetch',
            });
          },
        });
      },
    });
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle="List Category"
        actionRef={actionRef}
        rowKey="id"
        loading={loading}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              handleModalVisible(true);
              setImage('');
            }}
          >
            <PlusOutlined /> Create Category
          </Button>,
        ]}
        pagination={{
          defaultPageSize: 20,
          simple: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        search={{
          searchText: 'Search',
          resetText: 'Reset',
        }}
        options={{
          fullScreen: false,
          density: false,
          reload: true,
          setting: false,
        }}
        dataSource={listCate}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />

      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
          form={{ layout: 'vertical' }}
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          search={{
            submitText: 'Submit',
            resetText: 'Reset',
          }}
          rowKey="id"
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        >
          <ProTable
            {...formLayout}
            form={{
              layout: 'vertical',
              initialValues: {
                name: stepFormValues.c_name,
                parent: stepFormValues.c_parentId,
                order: stepFormValues.c_order,
                description: stepFormValues.c_description,
                status: stepFormValues.c_status,
              },
            }}
            onSubmit={async (value) => {
              const success = await handleUpdate(value);

              if (success) {
                handleUpdateModalVisible(false);
                setStepFormValues({});

                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            search={{
              submitText: 'Save',
              resetText: 'Reset',
            }}
            rowKey="id"
            type="form"
            columns={columns}
            rowSelection={{}}
          />
        </UpdateForm>
      ) : null}
    </PageContainer>
  );
};

export default connect(({ category, loading }) => ({
  listCate: category.listCate,
  loading: loading.effects['category/fetch'],
}))(Category);
