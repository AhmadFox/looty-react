import React from 'react';
import TimelineNode from './TimelineNode';
import { useSteps } from '../context/StepContext';
import { DataType } from '../types/contexts.types';

const Timeline: React.FC = () => {
  const { state } = useSteps();

  // Helper function to determine the timeline nodes dynamically
  const generateNodes = () => {
    const nodes = [];
    // Add the first two nodes
    nodes.push(
      <TimelineNode
        key={1}
        number={1}
        isLastNode={false}
        data={state.steps[0] as DataType}
      />
    );

    nodes.push(
      <TimelineNode
        key={2}
        number={2}
        isLastNode={false}
        data={state.steps[2] as DataType}
      />
    );

    nodes.push(
      <TimelineNode
        key={3}
        number={3}
        isLastNode={false}
        data={state.steps[3] as DataType}
      />
    );

    nodes.push(
      <TimelineNode
        key={4}
        number={4}
        isLastNode={false}
        data={state.steps[4] as DataType}
      />
    );

    // Remaining Nodes
    for (let i = 0; i < 4; i++) {
      const isLastNode = i === 3; // Last node in the sequence
      nodes.push(
        <TimelineNode
          key={3 + i}
          number={3 + i}
          isLastNode={isLastNode}
          data={state.steps[5 + i] as DataType}
        />
      );
    }

    return nodes;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {generateNodes()}
    </div>
  );
};

export default Timeline;
