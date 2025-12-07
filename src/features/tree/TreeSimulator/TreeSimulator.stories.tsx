import type { Meta, StoryObj } from '@storybook/react';
import { TreeSimulator } from './TreeSimulator';

const meta = {
  title: 'Features/TreeSimulator',
  component: TreeSimulator,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TreeSimulator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
