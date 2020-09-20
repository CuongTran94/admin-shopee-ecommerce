import {
  fetchData,
  createBlog,
  deleteData,
  fetchDataDetail,
  updateData,
  uploadPostCoverImage,
  uploadPostCoversImage,
} from '@/pages/Blog/service';
import { message } from 'antd';

const BlogModel = {
  namespace: 'blog',
  state: {
    categories: [],
    posts: [],
    postDetail: { content: '', title: '', category: '', coverImage: '' },
  },
  effects: {
    *fetchCategory(_, { call, put }) {
      const response = yield call(fetchData);
      yield put({
        type: 'getCategory',
        payload: response,
      });
    },
    *fetchPosts(_, { call, put }) {
      const posts = yield call(() => fetchData('blogs'));
      const newPosts = posts.map((post) => {
        return {
          ...post,
          published: post.published.toDate().toLocaleDateString('en-US'),
          key: post.id,
        };
      });
      yield put({
        type: 'getPosts',
        payload: newPosts,
      });
    },

    *deletePost({ payload }, { call, put }) {
      try {
        yield call(() => deleteData('blogs', payload));
        yield put({ type: 'removePost', payload });
        message.success('Delete successfully');
      } catch (error) {
        message.error('Delete failed');
      }
    },
    *fetchPostDetail({ payload }, { call, put }) {
      try {
        const post = yield call(() => fetchDataDetail('blogs', payload));
        yield put({ type: 'getPostDetail', post });
      } catch (error) {
        message.error('error ', error);
      }
    },
    *uploadCoverPost({ payload, callback }, { call, put }) {
      try {
        const url = yield call(uploadPostCoverImage, payload.img);
        const urls = yield call(uploadPostCoversImage, payload.images);
        yield callback({ url, urls });
        yield message.success('Upload successfully');
      } catch (error) {
        yield message.error(`Upload failed ${error}`);
        console.log('error: ', error);
      }
    },
    *createPost({ payload, callback }, { call, select }) {
      const author = yield select((state) => state.user.currentUser.username);
      try {
        const newPost = { ...payload, author };
        if (newPost.id === undefined) {
          delete newPost.id;
          yield call(createBlog, newPost);
          message.success('Success');
          return;
        }
        yield call(() => updateData('blogs', newPost));
        message.success('Success');
      } catch (error) {
        message.error(error);
      }
      if (callback) callback();
    },
  },

  reducers: {
    getCategory(state, action) {
      return {
        ...state,
        categories: action.payload || [],
      };
    },
    getPosts(state, action) {
      return {
        ...state,
        posts: action.payload || [],
      };
    },
    removePost(state, action) {
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };
    },
    getPostDetail(state, action) {
      return {
        ...state,
        postDetail: action.post,
      };
    },
    cleanPostDetail(state, action) {
      return {
        ...state,
        postDetail: [],
      };
    },
  },
};
export default BlogModel;
