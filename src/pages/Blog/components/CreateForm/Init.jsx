export const ToolBar = `undo redo | formatselect | bold italic backcolor | \
alignleft aligncenter alignright alignjustify | \
bullist numlist outdent indent | removeformat | help`;

export const Plugins = [
  'advlist autolink lists link image charmap print preview anchor',
  'searchreplace visualblocks code fullscreen',
  'insertdatetime media table paste code wordcount',
];

export const INIT = {
  height: 500,
  menubar: true,
  plugins: Plugins,
  toolbar: ToolBar,
  apiKey: '7t5oboh02n9lzhlqgoc68zmh8ibr9dg9mexgxqxt2qoj51vv',
};
