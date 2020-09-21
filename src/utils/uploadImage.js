import { message } from 'antd';
import Resizer from 'react-image-file-resizer';

const resizeFile = (file, maxWidth = 360, maxHeight = 240) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      'JPG',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'blob',
    );
  });

function blobToFile(theBlob, fileName) {
  // eslint-disable-next-line no-param-reassign
  theBlob.lastModifiedDate = new Date();
  // eslint-disable-next-line no-param-reassign
  theBlob.name = fileName;
  return theBlob;
}

export const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

export const beforeUpload = async (file, setImage, setImages) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  if (isJpgOrPng && isLt2M) {
    const { name } = file;
    const small = await resizeFile(file, 116, 80);
    const medium = await resizeFile(file, 360, 240);
    const large = await resizeFile(file, 793, 396);
    const smallAddAtributes = blobToFile(small, `${name}1`);
    const mediumAddAtributes = blobToFile(medium, `${name}2`);
    const largeAddAtributes = blobToFile(large, `${name}3`);
    setImage(file);
    setImages({ small: smallAddAtributes, medium: mediumAddAtributes, large: largeAddAtributes });
  }
  return isJpgOrPng && isLt2M;
};

export const handleChange = (info, setLoading, setUrlImage) => {
  if (info.file.status === 'uploading') {
    setLoading(true);
    return;
  }

  if (info.file.status === 'done') {
    getBase64(info.file.originFileObj, (imageUrl) => {
      setUrlImage(imageUrl);
      setLoading(false);
    });
  }
};
