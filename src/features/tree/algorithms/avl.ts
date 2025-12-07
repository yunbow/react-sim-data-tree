import { TreeNode, TreeStep } from '../../../types';

interface AVLNode extends TreeNode {
  height?: number;
}

// Deep clone
function cloneNode(node: AVLNode | null | undefined): AVLNode | null {
  if (!node) return null;

  const cloned: AVLNode = {
    id: node.id,
    value: node.value,
    state: node.state,
    height: node.height || 0,
  };

  if (node.left) {
    cloned.left = cloneNode(node.left as AVLNode);
    if (cloned.left) cloned.left.parent = cloned;
  }

  if (node.right) {
    cloned.right = cloneNode(node.right as AVLNode);
    if (cloned.right) cloned.right.parent = cloned;
  }

  return cloned;
}

function getHeight(node: AVLNode | null | undefined): number {
  return node ? (node.height || 0) : 0;
}

function updateHeight(node: AVLNode): void {
  node.height = 1 + Math.max(getHeight(node.left as AVLNode), getHeight(node.right as AVLNode));
}

function getBalance(node: AVLNode | null | undefined): number {
  return node ? getHeight(node.left as AVLNode) - getHeight(node.right as AVLNode) : 0;
}

function rotateRight(y: AVLNode): AVLNode {
  const x = y.left as AVLNode;
  const T2 = x.right as AVLNode;

  x.right = y;
  y.left = T2;

  updateHeight(y);
  updateHeight(x);

  return x;
}

function rotateLeft(x: AVLNode): AVLNode {
  const y = x.right as AVLNode;
  const T2 = y.left as AVLNode;

  y.left = x;
  x.right = T2;

  updateHeight(x);
  updateHeight(y);

  return y;
}

export function* avlInsertSingle(existingRoot: TreeNode | null, value: number): Generator<TreeStep> {
  const root = cloneNode(existingRoot as AVLNode);
  let operations = 0;

  const resetStates = (node: AVLNode | null): void => {
    if (!node) return;
    node.state = 'default';
    resetStates(node.left as AVLNode);
    resetStates(node.right as AVLNode);
  };

  if (!root) {
    const newRoot: AVLNode = {
      id: `node-${value}`,
      value,
      state: 'committed',
      height: 1,
    };
    yield {
      nodes: [newRoot],
      description: `ルートノードに ${value} を挿入`,
      operations: 1,
    };
    return;
  }

  resetStates(root);

  yield {
    nodes: [root],
    description: `AVL木に ${value} を挿入中...`,
    operations,
  };

  function* insertNode(node: AVLNode | null, val: number): Generator<[AVLNode, TreeStep]> {
    if (!node) {
      operations++;
      const newNode: AVLNode = {
        id: `node-${val}-${Date.now()}`,
        value: val,
        state: 'candidate',
        height: 1,
      };
      yield [
        newNode,
        {
          nodes: [root],
          description: `${val} を新しいノードとして挿入`,
          operations,
        },
      ];
      return;
    }

    operations++;
    node.state = 'visiting';
    yield [
      node,
      {
        nodes: [root],
        description: `${val} と ${node.value} を比較中`,
        operations,
      },
    ];

    if (val < (node.value as number)) {
      node.state = 'default';
      const gen = insertNode(node.left as AVLNode, val);
      let result = gen.next();
      while (!result.done) {
        const [newLeft, step] = result.value;
        node.left = newLeft;
        if (newLeft) newLeft.parent = node;
        yield [node, step];
        result = gen.next();
      }
    } else if (val > (node.value as number)) {
      node.state = 'default';
      const gen = insertNode(node.right as AVLNode, val);
      let result = gen.next();
      while (!result.done) {
        const [newRight, step] = result.value;
        node.right = newRight;
        if (newRight) newRight.parent = node;
        yield [node, step];
        result = gen.next();
      }
    } else {
      node.state = 'default';
      yield [
        node,
        {
          nodes: [root],
          description: `${val} は既に存在します`,
          operations,
        },
      ];
      return;
    }

    updateHeight(node);

    const balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && val < ((node.left as AVLNode).value as number)) {
      operations++;
      yield [
        node,
        {
          nodes: [root],
          description: `左左ケース: 右回転を実行`,
          operations,
        },
      ];
      const rotated = rotateRight(node);
      yield [rotated, { nodes: [root], description: `回転完了`, operations }];
      return;
    }

    // Right Right Case
    if (balance < -1 && val > ((node.right as AVLNode).value as number)) {
      operations++;
      yield [
        node,
        {
          nodes: [root],
          description: `右右ケース: 左回転を実行`,
          operations,
        },
      ];
      const rotated = rotateLeft(node);
      yield [rotated, { nodes: [root], description: `回転完了`, operations }];
      return;
    }

    // Left Right Case
    if (balance > 1 && val > ((node.left as AVLNode).value as number)) {
      operations++;
      yield [
        node,
        {
          nodes: [root],
          description: `左右ケース: 左回転→右回転を実行`,
          operations,
        },
      ];
      node.left = rotateLeft(node.left as AVLNode);
      const rotated = rotateRight(node);
      yield [rotated, { nodes: [root], description: `回転完了`, operations }];
      return;
    }

    // Right Left Case
    if (balance < -1 && val < ((node.right as AVLNode).value as number)) {
      operations++;
      yield [
        node,
        {
          nodes: [root],
          description: `右左ケース: 右回転→左回転を実行`,
          operations,
        },
      ];
      node.right = rotateRight(node.right as AVLNode);
      const rotated = rotateLeft(node);
      yield [rotated, { nodes: [root], description: `回転完了`, operations }];
      return;
    }

    node.state = 'default';
    yield [node, { nodes: [root], description: `ノード更新完了`, operations }];
  }

  const generator = insertNode(root, value);
  let result = generator.next();

  while (!result.done) {
    const [, step] = result.value;
    if (step) yield step;
    result = generator.next();
  }

  resetStates(root);

  yield {
    nodes: [root],
    description: `挿入が完了しました（AVL木はバランスを保っています）`,
    operations,
  };
}

export function* avlInsert(values: number[]): Generator<TreeStep> {
  let root: AVLNode | null = null;

  for (const value of values) {
    const generator = avlInsertSingle(root, value);
    let result = generator.next();

    while (!result.done) {
      const step = result.value;
      if (step.nodes.length > 0) {
        root = step.nodes[0] as AVLNode;
      }
      yield step;
      result = generator.next();
    }

    if (root) {
      root = cloneNode(root);
    }
  }
}
