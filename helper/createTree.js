let count = 0;
function buildTree(arr, parentId = "") {
  const tree = [];

  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      count++;
      const newItem = item;
      newItem.index = count;
      const children = buildTree(arr, item.id);

      if (children.length > 0) {
        newItem.children = children;
      }

      tree.push(newItem);
    }
  });

  return tree;
}

module.exports.createTree = (arr, parentId = "") => {
  count = 0;
  const tree = buildTree(arr, (parentId = ""));
  return tree;
};
