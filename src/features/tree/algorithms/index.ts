import { TreeAlgorithm, TreeStep, TreeNode } from '../../../types';
import { bstInsert, bstInsertSingle, bstDelete } from './bst';
import { avlInsert, avlInsertSingle } from './avl';
import { heapInsert, heapInsertSingle } from './heap';
import { redblackInsert, redblackInsertSingle } from './redblack';

export function getTreeInsertSingle(
  algorithm: TreeAlgorithm,
  existingRoot: TreeNode | null,
  value: number
): Generator<TreeStep> {
  switch (algorithm) {
    case 'bst':
      return bstInsertSingle(existingRoot, value);
    case 'avl':
      return avlInsertSingle(existingRoot, value);
    case 'redblack':
      return redblackInsertSingle(existingRoot, value);
    case 'minheap':
      return heapInsertSingle(existingRoot, value, 'min');
    case 'maxheap':
      return heapInsertSingle(existingRoot, value, 'max');
    default:
      return (function* () {
        yield {
          nodes: existingRoot ? [existingRoot] : [],
          description: 'このアルゴリズムはまだ実装されていません',
          operations: 0,
        };
      })();
  }
}

export function getTreeAlgorithm(
  algorithm: TreeAlgorithm,
  operation: 'insert' | 'delete',
  values: number[],
  deleteValue?: number
): Generator<TreeStep> {
  if (operation === 'insert') {
    switch (algorithm) {
      case 'bst':
        return bstInsert(values);
      case 'avl':
        return avlInsert(values);
      case 'redblack':
        return redblackInsert(values);
      case 'minheap':
        return heapInsert(values, 'min');
      case 'maxheap':
        return heapInsert(values, 'max');
      default:
        return (function* () {
          yield {
            nodes: [],
            description: 'このアルゴリズムはまだ実装されていません',
            operations: 0,
          };
        })();
    }
  } else {
    // Delete operation
    switch (algorithm) {
      case 'bst':
        const generator = bstInsert(values);
        let lastStep: TreeStep | null = null;
        let result = generator.next();

        while (!result.done) {
          lastStep = result.value;
          result = generator.next();
        }

        if (lastStep && deleteValue !== undefined) {
          return bstDelete(lastStep.nodes[0] || null, deleteValue);
        }

        return (function* () {
          yield {
            nodes: [],
            description: '削除する値が指定されていません',
            operations: 0,
          };
        })();
      default:
        return (function* () {
          yield {
            nodes: [],
            description: 'このアルゴリズムの削除操作は近日実装予定です',
            operations: 0,
          };
        })();
    }
  }
}
