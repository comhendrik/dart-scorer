import {Button} from "@tremor/react";
import React from "react";
import GameMode from "../interfaces/GameMode";


interface AroundTheClockProps {
    onEndGame: () => {};
}

function AroundTheClock({ onEndGame } : AroundTheClockProps) {

    return (
        <div>
            ATC is under development, please wait for development
            <Button
                className="w-full bg-red-500 text-white hover:bg-red-600 transition duration-200 rounded-lg"
                onClick={onEndGame}
            >
                End
            </Button>
        </div>
    );
}

export default AroundTheClock;
