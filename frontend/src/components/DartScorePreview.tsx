import React from "react";
import { Card, Title, Subtitle } from "@tremor/react";
import { ForwardIcon, PlayCircleIcon } from "@heroicons/react/16/solid";

interface DartScorePreviewProps {
  playerNames: string[];
}

const DartScorePreview: React.FC<DartScorePreviewProps> = ({ playerNames }) => {
  const fakeScores = playerNames.map(() => 301);
  const fakeAverages = playerNames.map(() => 46.7);
  const fakeLegs = playerNames.map(() => 1);
  const fakeSets = playerNames.map(() => 0);
  const dartsThrown = [60, 20, 1];
  const suggestedFinish = ["T20", "D20"];

  const dartValues = Array.from({ length: 20 }, (_, i) => i + 1);
  const actionColors = {
    double: "bg-orange-500",
    triple: "bg-orange-500",
    blue: "bg-blue-500",
    red: "bg-red-500"
  };

  const Rectangle = ({ text, color }: { text: string | number; color: string }) => (
    <div className={`text-white text-center text-sm py-2 rounded ${color}`}>
      {text}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl p-4 bg-white rounded-lg shadow">
      <div className="flex flex-wrap justify-around items-center gap-4 mb-6">
        {fakeScores.map((score, index) => (
          <div key={index} className="text-center">
            <Title className="text-xl bg-gray-300 rounded-lg p-1">{score}</Title>
            <Subtitle>{playerNames[index]}</Subtitle>
            <Subtitle>⊘: {fakeAverages[index]}</Subtitle>
            <Subtitle>S: {fakeSets[index]}</Subtitle>
            <Subtitle>L: {fakeLegs[index]}</Subtitle>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <PlayCircleIcon className="h-6 w-6 text-gray-500" />
        {dartsThrown.map((score, idx) => (
          <Title key={idx} className="text-lg">{score}</Title>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <ForwardIcon className="h-6 w-6 text-gray-500" />
        {suggestedFinish.map((score, idx) => (
          <Title key={idx} className="text-lg">{score}</Title>
        ))}
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 mb-6">
        {dartValues.map((dart) => (
          <Rectangle key={dart} text={dart} color={actionColors.blue} />
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        <Rectangle text="Double" color={actionColors.double} />
        <Rectangle text="Triple" color={actionColors.triple} />
        <Rectangle text="25" color={actionColors.blue} />
        <Rectangle text="50" color={actionColors.blue} />
        <Rectangle text="0" color={actionColors.blue} />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Rectangle text="End" color={actionColors.red} />
        <Rectangle text="Revert" color={actionColors.red} />
        <Rectangle text="Reset" color={actionColors.red} />
        <Rectangle text="Next" color={actionColors.red} />
      </div>
    </Card>
  );
};

export default DartScorePreview;
