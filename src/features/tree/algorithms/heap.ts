import { TreeNode, TreeStep } from '../../../types';

type HeapType = 'min' | 'max';

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

// Convert array to tree representation
function arrayToTree(arr: number[]): TreeNode | null {
  if (arr.length === 0) return null;

  const nodes: TreeNode[] = arr.map((val, idx) => ({
    id: `node-${val}-${idx}`,
    value: val,
    state: 'default',
  }));

  for (let i = 0; i < arr.length; i++) {
    const leftIdx = 2 * i + 1;
    const rightIdx = 2 * i + 2;

    if (leftIdx < arr.length) {
      nodes[i].left = nodes[leftIdx];
      nodes[leftIdx].parent = nodes[i];
    }

    if (rightIdx < arr.length) {
      nodes[i].right = nodes[rightIdx];
      nodes[rightIdx].parent = nodes[i];
    }
  }

  return nodes[0];
}

function treeToArray(root: TreeNode | null): number[] {
  if (!root) return [];

  const result: number[] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node.value as number);

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
}

export function* heapInsertSingle(
  existingRoot: TreeNode | null,
  value: number,
  heapType: HeapType
): Generator<TreeStep> {
  let operations = 0;
  const arr = existingRoot ? treeToArray(existingRoot) : [];

  arr.push(value);
  operations++;

  yield {
    nodes: arrayToTree(arr) ? [arrayToTree(arr)!] : [],
    description: `${value} を配列の末尾に追加`,
    operations,
  };

  let idx = arr.length - 1;

  const shouldSwap = (childVal: number, parentVal: number): boolean => {
    return heapType === 'min' ? childVal < parentVal : childVal > parentVal;
  };

  while (idx > 0) {
    const parentIdx = Math.floor((idx - 1) / 2);
    operations++;

    const tree = arrayToTree(arr);
    if (tree) {
      yield {
        nodes: [tree],
        description: `${arr[idx]} と親 ${arr[parentIdx]} を比較中`,
        operations,
      };
    }

    if (shouldSwap(arr[idx], arr[parentIdx])) {
      [arr[idx], arr[parentIdx]] = [arr[parentIdx], arr[idx]];
      operations++;

      const tree = arrayToTree(arr);
      if (tree) {
        yield {
          nodes: [tree],
          description: `${arr[parentIdx]} と ${arr[idx]} を交換`,
          operations,
        };
      }

      idx = parentIdx;
    } else {
      break;
    }
  }

  const finalTree = arrayToTree(arr);
  if (finalTree) {
    yield {
      nodes: [finalTree],
      description: `ヒープ性質を満たしました`,
      operations,
    };
  }
}

export function* heapInsert(values: number[], heapType: HeapType): Generator<TreeStep> {
  let root: TreeNode | null = null;

  for (const value of values) {
    const generator = heapInsertSingle(root, value, heapType);
    let result = generator.next();

    while (!result.done) {
      const step = result.value;
      if (step.nodes.length > 0) {
        root = cloneNode(step.nodes[0]);
      }
      yield step;
      result = generator.next();
    }
  }
}
