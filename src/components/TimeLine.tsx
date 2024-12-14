import React from 'react';
import TimelineNode from './TimelineNode';
import { useSteps } from '../context/StepContext';

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
        data={state.steps[0]}
      />
    );

    nodes.push(
      <TimelineNode
        key={2}
        number={2}
        isLastNode={false}
        data={state.steps[2]}
      />
    );

    // Conditional Nodes
    if (state.selectionType === 'multi-selection' || state.selectionType === 'group-selection') {
      nodes.push(
        <TimelineNode
          key={3}
          number={3}
          isLastNode={false}
          data={state.steps[3]}
        />
      );
    } else {
      nodes.push(
        <div key="conditional-group">
          <TimelineNode
            number={3}
            isLastNode={false}
            data={state.steps[4]}
          />
          <TimelineNode
            number={4}
            isLastNode={false}
            data={state.steps[5]}
          />
        </div>
      );
    }

    // Remaining Nodes
    const baseNumber = state.selectionType === 'multi-selection' ? 4 : 5;
    for (let i = 0; i < 4; i++) {
      const isLastNode = i === 3; // Last node in the sequence
      nodes.push(
        <TimelineNode
          key={baseNumber + i}
          number={baseNumber + i}
          isLastNode={isLastNode}
          data={state.steps[6 + i]}
        />
      );
    }

    return nodes;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {generateNodes()}
      </div>
    </div>
  );
};

export default Timeline;
