import { TreeNode, TreeStep } from '../../../types';

// Deep clone a tree node to avoid mutation
function cloneNode(node: TreeNode | null | undefined): TreeNode | null {
  if (!node) return null;

  const cloned: TreeNode = {
    id: node.id,
    value: node.value,
    state: node.state,
  };

  if (node.left) {
    cloned.left = cloneNode(node.left);
    if (cloned.left) cloned.left.parent = cloned;
  }

  if (node.right) {
    cloned.right = cloneNode(node.right);
    if (cloned.right) cloned.right.parent = cloned;
  }

  return cloned;
}

// Insert a single value into an existing tree
export function* bstInsertSingle(existingRoot: TreeNode | null, value: number): Generator<TreeStep> {
  const root = cloneNode(existingRoot);
  let operations = 0;

  if (!root) {
    const newRoot: TreeNode = {
      id: `node-${value}`,
      value,
      state: 'committed',
    };
    yield {
      nodes: [newRoot],
      description: `ルートノードに ${value} を挿入`,
      operations: operations + 1,
    };
    return;
  }

  let current: TreeNode | null = root;
  let parent: TreeNode | null = null;
  let isLeft = false;

  // Reset all nodes to default state first
  const resetStates = (node: TreeNode | null | undefined): void => {
    if (!node) return;
    node.state = 'default';
    resetStates(node.left);
    resetStates(node.right);
  };
  resetStates(root);

  yield {
    nodes: [root],
    description: `${value} の挿入位置を探索中...`,
    operations,
  };

  // Search for insertion point
  while (current) {
    operations++;
    parent = current;
    current.state = 'visiting';

    yield {
      nodes: [root],
      description: `${value} と ${current.value} を比較中`,
      operations,
    };

    if (value < (current.value as number)) {
      current.state = 'default';
      current = current.left || null;
      isLeft = true;
    } else {
      current.state = 'default';
      current = current.right || null;
      isLeft = false;
    }
  }

  // Insert new node
  operations++;
  const newNode: TreeNode = {
    id: `node-${value}-${Date.now()}`,
    value,
    state: 'candidate',
    parent,
  };

  if (parent) {
    if (isLeft) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
  }

  yield {
    nodes: [root],
    description: `${value} を ${isLeft ? '左' : '右'}の子として挿入`,
    operations,
  };

  newNode.state = 'committed';
  if (parent) {
    parent.state = 'default';
  }

  yield {
    nodes: [root],
    description: `${value} の挿入完了`,
    operations,
  };

  // Reset all states
  resetStates(root);

  yield {
    nodes: [root],
    description: `挿入が完了しました`,
    operations,
  };
}

export function* bstInsert(values: number[]): Generator<TreeStep> {
  let root: TreeNode | null = null;
  let operations = 0;

  for (const value of values) {
    operations++;

    if (!root) {
      root = {
        id: `node-${value}`,
        value,
        state: 'committed',
      };
      yield {
        nodes: [root],
        description: `ルートノードに ${value} を挿入`,
        operations,
      };
      continue;
    }

    let current: TreeNode | null = root;
    let parent: TreeNode | null = null;
    let isLeft = false;

    // Search for insertion point
    while (current) {
      parent = current;
      current.state = 'visiting';

      yield {
        nodes: [root],
        description: `${value} と ${current.value} を比較中`,
        operations,
      };

      if (value < (current.value as number)) {
        current.state = 'default';
        current = current.left || null;
        isLeft = true;
      } else {
        current.state = 'default';
        current = current.right || null;
        isLeft = false;
      }
    }

    // Insert new node
    const newNode: TreeNode = {
      id: `node-${value}`,
      value,
      state: 'candidate',
      parent,
    };

    if (parent) {
      if (isLeft) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
    }

    yield {
      nodes: [root],
      description: `${value} を ${isLeft ? '左' : '右'}の子として挿入`,
      operations,
    };

    newNode.state = 'committed';
    if (parent) {
      parent.state = 'default';
    }

    yield {
      nodes: [root],
      description: `${value} の挿入完了`,
      operations,
    };
  }

  // Mark all nodes as default at the end
  const resetStates = (node: TreeNode | null | undefined): void => {
    if (!node) return;
    node.state = 'default';
    resetStates(node.left);
    resetStates(node.right);
  };

  resetStates(root);

  yield {
    nodes: root ? [root] : [],
    description: 'すべての挿入が完了しました',
    operations,
  };
}

export function* bstDelete(root: TreeNode | null, value: number): Generator<TreeStep> {
  let operations = 0;

  if (!root) {
    yield {
      nodes: [],
      description: '木が空です',
      operations,
    };
    return;
  }

  // Find the node to delete
  let current: TreeNode | null = root;
  let parent: TreeNode | null = null;
  let isLeft = false;

  while (current && current.value !== value) {
    operations++;
    parent = current;
    current.state = 'visiting';

    yield {
      nodes: [root],
      description: `${value} を探索中 (現在: ${current.value})`,
      operations,
    };

    if (value < (current.value as number)) {
      current.state = 'default';
      current = current.left || null;
      isLeft = true;
    } else {
      current.state = 'default';
      current = current.right || null;
      isLeft = false;
    }
  }

  if (!current) {
    yield {
      nodes: [root],
      description: `${value} が見つかりませんでした`,
      operations,
    };
    return;
  }

  current.state = 'comparing';
  yield {
    nodes: [root],
    description: `${value} を削除します`,
    operations,
  };

  // Case 1: Node with no children (leaf node)
  if (!current.left && !current.right) {
    if (!parent) {
      root = null;
    } else if (isLeft) {
      parent.left = undefined;
    } else {
      parent.right = undefined;
    }

    yield {
      nodes: root ? [root] : [],
      description: `葉ノード ${value} を削除しました`,
      operations,
    };
    return;
  }

  // Case 2: Node with one child
  if (!current.left || !current.right) {
    const child = current.left || current.right;

    if (!parent) {
      root = child || null;
    } else if (isLeft) {
      parent.left = child;
    } else {
      parent.right = child;
    }

    if (child) {
      child.parent = parent;
    }

    yield {
      nodes: root ? [root] : [],
      description: `子が1つのノード ${value} を削除しました`,
      operations,
    };
    return;
  }

  // Case 3: Node with two children
  // Find inorder successor (smallest in the right subtree)
  let successor = current.right;
  let successorParent: TreeNode | null = current;

  while (successor && successor.left) {
    operations++;
    successorParent = successor;
    successor = successor.left;
  }

  if (successor) {
    successor.state = 'candidate';
    yield {
      nodes: [root],
      description: `後継ノード ${successor.value} を見つけました`,
      operations,
    };

    current.value = successor.value;

    if (successorParent !== current) {
      successorParent.left = successor.right;
    } else {
      successorParent.right = successor.right;
    }

    if (successor.right) {
      successor.right.parent = successorParent;
    }

    current.state = 'committed';
    yield {
      nodes: [root],
      description: `ノード ${value} を後継ノードで置き換えました`,
      operations,
    };
  }

  // Reset all states
  const resetStates = (node: TreeNode | null | undefined): void => {
    if (!node) return;
    node.state = 'default';
    resetStates(node.left);
    resetStates(node.right);
  };

  resetStates(root);

  yield {
    nodes: root ? [root] : [],
    description: '削除が完了しました',
    operations,
  };
}
