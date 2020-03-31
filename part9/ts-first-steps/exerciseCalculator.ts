interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyHours: number[],
  target: number
): Result => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((hour) => hour > 0).length;
  const totalHours = dailyHours.reduce((total, hours) => total + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;
  const percentageRating = (average / target) * 100;

  let rating;
  let ratingDescription;

  if (percentageRating >= 100) {
    rating = 3;
    ratingDescription = "You've met your daily exercise target!";
  } else if (percentageRating >= 75 && percentageRating < 100) {
    rating = 2;
    ratingDescription = "You're almost there";
  } else {
    rating = 1;
    ratingDescription = "There is still much room for improvement";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

interface ParsedExerciseArgs {
  target: number;
  dailyHours: number[];
}

const parseArguments = (args: Array<string>): ParsedExerciseArgs => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target = Number(args[2]);
  const dailyHours = args.slice(3).map((hours) => Number(hours));
  const hasNaNInDailyHours = dailyHours.some((hours) => isNaN(hours));

  if (isNaN(target) || hasNaNInDailyHours) {
    throw new Error("Please provide arguments as numbers");
  }

  const hasInvalidDailyHours = dailyHours.some((hours) => hours > 24);

  if (target > 24 || hasInvalidDailyHours) {
    throw new Error("Maximum hours per day is 24");
  }

  return { target, dailyHours };
};

const isCalledDirectly = require.main === module;

if (isCalledDirectly) {
  try {
    const { target, dailyHours } = parseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (e) {
    console.log("An error has occured:", e.message);
    console.log(
      "USAGE: npm run calculateExercises target(hrs) dailyHours(hrs)[]"
    );
    console.log("dailyHours is space separated hours exercised per day");
  }
}
