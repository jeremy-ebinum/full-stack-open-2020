interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (dailyHours: number[], target: number): Result => {
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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
