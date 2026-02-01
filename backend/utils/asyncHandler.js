/**
 * @param {Function} fn – an async (req, res, next) route handler
 * @returns {Function}  – a wrapped (req, res, next) handler that catches rejections
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default asyncHandler;