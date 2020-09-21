import React from 'react';
import { Upload, Button } from 'antd';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { beforeUpload, handleChange } from '@/utils/uploadImage';

import { StyledOption } from './Styled';

export const uploadButton = (loading) => {
  return (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
};

export const categoriesRender = (categories) => {
  return categories.map((category_) => {
    return (
      <StyledOption value={category_.id} key={category_.id}>
        {category_.name}
      </StyledOption>
    );
  });
};

export const upload = ({ urlImage, setUrlImage, setImage, loading, setLoading, setImages }) => (
  <Upload
    name="cover"
    listType="picture-card"
    className="avatar-uploader"
    showUploadList={false}
    beforeUpload={(file) => beforeUpload(file, setImage, setImages)}
    onChange={(info) => handleChange(info, setLoading, setUrlImage)}
  >
    {urlImage ? (
      <img src={urlImage} alt="cover" style={{ width: '100%' }} />
    ) : (
      uploadButton(loading)
    )}
  </Upload>
);


export const buttonUpload = (handleImageUpload, img) => {
  return (
    <Button type="primary" onClick={() => handleImageUpload(img)}>
      Upload
    </Button>
  );
};