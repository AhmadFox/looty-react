import React from 'react';
import TimelineNode from './TimelineNode';
import { useSteps } from '../context/StepContext';
import { DataType } from '../types/contexts.types';

const Timeline: React.FC = () => {
	const { state } = useSteps();

	// Helper function to determine the timeline nodes dynamically
	const generateTimeLine = () => {
		const nodes = [];
		const nodeLength = state.steps.length - 1

		// Remaining Nodes
		for (let i = 0; i <= nodeLength; i++) {
			nodes.push(
				<TimelineNode
					key={i}
					number={i + 1}
					isLastNode={i === nodeLength}
					step={state.steps[i] as DataType}
				/>
			);
		}

		return nodes;
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{generateTimeLine()}
		</div>
	);
};

export default Timeline;
