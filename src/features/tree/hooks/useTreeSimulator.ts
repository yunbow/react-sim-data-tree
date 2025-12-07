import { useState, useRef, useCallback, useEffect } from 'react';
import { TreeAlgorithm, TreeNode, TreeStats, TreeStep } from '../../../types';
import { getTreeAlgorithm, getTreeInsertSingle } from '../algorithms';

export function useTreeSimulator(initialAlgorithm: TreeAlgorithm = 'bst') {
  const [algorithm, setAlgorithm] = useState<TreeAlgorithm>(initialAlgorithm);
  const [nodeCount, setNodeCount] = useState(10);
  const [insertValue, setInsertValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [speed, setSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(false);

  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [stats, setStats] = useState<TreeStats>({
    operations: 0,
    height: 0,
    nodeCount: 0,
    steps: 0,
  });
  const [description, setDescription] = useState('');

  const generatorRef = useRef<Generator<TreeStep> | null>(null);
  const animationRef = useRef<number | null>(null);

  const calculateHeight = useCallback((node: TreeNode | null | undefined): number => {
    if (!node) return 0;
    return 1 + Math.max(calculateHeight(node.left), calculateHeight(node.right));
  }, []);

  const countNodes = useCallback((node: TreeNode | null | undefined): number => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  }, []);

  const generateRandomValues = useCallback((count: number): number[] => {
    const values: number[] = [];
    const used = new Set<number>();

    while (values.length < count) {
      const value = Math.floor(Math.random() * 100) + 1;
      if (!used.has(value)) {
        used.add(value);
        values.push(value);
      }
    }

    return values;
  }, []);

  const initializeTree = useCallback(() => {
    const values = generateRandomValues(nodeCount);
    generatorRef.current = getTreeAlgorithm(algorithm, 'insert', values);
    setNodes([]);
    setStats({
      operations: 0,
      height: 0,
      nodeCount: 0,
      steps: 0,
    });
    setDescription('初期ツリーを生成中...');
    setIsRunning(true);

    // Start automatic tree generation
    const buildTree = () => {
      if (!generatorRef.current) return;

      const result = generatorRef.current.next();

      if (!result.done) {
        const step = result.value;
        setNodes(step.nodes.filter((n): n is TreeNode => n !== null));
        setDescription(step.description);
        setStats((prev) => {
          const root = step.nodes[0] || null;
          return {
            operations: step.operations,
            height: calculateHeight(root),
            nodeCount: countNodes(root),
            steps: prev.steps + 1,
          };
        });

        // Fast generation (50ms delay)
        animationRef.current = window.setTimeout(buildTree, 50);
      } else {
        setIsRunning(false);
        setDescription(`${nodeCount}個のノードでツリーを初期化しました`);
      }
    };

    buildTree();
  }, [algorithm, nodeCount, generateRandomValues, calculateHeight, countNodes]);

  useEffect(() => {
    initializeTree();
  }, [initializeTree]);

  const executeStep = useCallback(() => {
    if (!generatorRef.current) return;

    const result = generatorRef.current.next();

    if (!result.done) {
      const step = result.value;
      setNodes(step.nodes.filter((n): n is TreeNode => n !== null));
      setDescription(step.description);
      setStats((prev) => {
        const root = step.nodes[0] || null;
        return {
          operations: step.operations,
          height: calculateHeight(root),
          nodeCount: countNodes(root),
          steps: prev.steps + 1,
        };
      });

      const delay = Math.max(10, 1000 - speed * 10);
      animationRef.current = window.setTimeout(() => {
        executeStep();
      }, delay);
    } else {
      setIsRunning(false);
    }
  }, [speed, calculateHeight, countNodes]);

  const handleInsert = useCallback(() => {
    if (!insertValue || isRunning) return;

    const value = parseInt(insertValue, 10);
    if (isNaN(value)) return;

    // Use the single insert function to only animate the new node
    const currentRoot = nodes.length > 0 ? nodes[0] : null;
    generatorRef.current = getTreeInsertSingle(algorithm, currentRoot, value);

    setIsRunning(true);
    setStats((prev) => ({ ...prev, steps: 0 }));
    executeStep();
    setInsertValue('');
  }, [algorithm, insertValue, isRunning, nodes, executeStep]);

  const handleDelete = useCallback(() => {
    if (!deleteValue || isRunning) return;

    const value = parseInt(deleteValue, 10);
    if (isNaN(value)) return;

    // Build current tree state first
    const currentValues: number[] = [];
    const collectValues = (node: TreeNode | null | undefined): void => {
      if (!node) return;
      currentValues.push(node.value as number);
      collectValues(node.left);
      collectValues(node.right);
    };

    if (nodes.length > 0) {
      collectValues(nodes[0]);
    }

    generatorRef.current = getTreeAlgorithm(algorithm, 'delete', currentValues, value);
    setIsRunning(true);
    setStats((prev) => ({ ...prev, steps: 0 }));
    executeStep();
    setDeleteValue('');
  }, [algorithm, deleteValue, nodes, isRunning, executeStep]);

  const reset = useCallback(() => {
    if (animationRef.current !== null) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }

    generatorRef.current = null;
    initializeTree();
  }, [initializeTree]);

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return {
    algorithm,
    nodeCount,
    insertValue,
    deleteValue,
    speed,
    isRunning,
    nodes,
    stats,
    description,
    setAlgorithm,
    setNodeCount,
    setInsertValue,
    setDeleteValue,
    setSpeed,
    handleInsert,
    handleDelete,
    reset,
  };
}
