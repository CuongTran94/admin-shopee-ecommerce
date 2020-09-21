export const handleEditorChange = (val, timeoutRef, setContent) => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  // eslint-disable-next-line no-param-reassign
  timeoutRef.current = setTimeout(() => {
    setContent(val);
  }, 400);
};
