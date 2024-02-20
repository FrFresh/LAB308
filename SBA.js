// // Accept input data
// function processData(input) {

//     // Process input
//     let processedData = input.map(item => {
//       return {
//         name: item.name,
//         // additional processing
//         formatted: formatItem(item) 
//       }
//     });
  
//     // Return output
//     return processedData;
  
//   }
  
  // Sample output formatting
//   function formatItem(item) {
//     return item.name.toUpperCase();
//   }
  
//   // Get learner data function
// function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {

//     // Validate data
//     validateData(courseInfo, assignmentGroup, learnerSubmissions);
  
//     // Process submissions and calculate scores
//     const results = processSubmissions(assignmentGroup, learnerSubmissions);
  
//     // Return results
//     return results;
  
//   }
  
//   // Validate data for errors
//   function validateData() {
//     // Check for invalid course ID
//     // Check for non-numeric fields
//     // Throw errors
//   }
  
//   // Process submissions and calculate scores  
//   function processSubmissions(assignmentGroup, learnerSubmissions) {
  
//     // Results array
//     const results = [];
  
//     // Loop through submissions
//     learnerSubmissions.forEach(submission => {
  
//       // Calculate assignment percentage
//       const percentage = calculatePercentage(
//         submission, 
//         assignmentGroup
//       );
  
//       // Filter incomplete assignments
  
//       // Add to results
//       results.push({
//         id: submission.learner_id,
//         avg: calculateAverage(submission),
//         [assignment.id]: percentage  
//       });
  
//     });
  
//     return results;
  
//   }
  
//   // Calculate average score
//   function calculateAverage() {
//     // ...
//   }
  
//   // Calculate assignment percentage
//   function calculatePercentage() {
//     // ... 
//   }
  
//   // Export function
//   module.exports = {
//     getLearnerData
//   };
  
function getLearnerData(courseInfo, assignmentGroups, learnerSubmissions) {
  const learners = {};
  const now = new Date();

  assignmentGroups.forEach(group => {
      group.assignments.forEach(assignment => {
          const dueDate = new Date(assignment.due_at);

          if (now < dueDate) return; // Skip not yet due assignments

          learnerSubmissions.forEach(submission => {
              if (submission.assignment_id === assignment.id) {
                  const learnerId = submission.learner_id;
                  const submittedAt = new Date(submission.submission.submitted_at);
                  let score = submission.submission.score;
                  const pointsPossible = assignment.points_possible;

                  // Apply late penalty if submission is late
                  if (submittedAt > dueDate) {
                      const latePenalty = pointsPossible * 0.1; // 10% penalty
                      score = Math.max(score - latePenalty, 0);
                  }

                  const percentage = (score / pointsPossible) * 100;

                  if (!learners[learnerId]) {
                      learners[learnerId] = {id: learnerId, scores: [], totalWeightedScores: 0, totalPossible: 0};
                  }

                  if (!learners[learnerId][assignment.id]) {
                      learners[learnerId][assignment.id] = percentage;
                  }

                  learners[learnerId].scores.push({percentage, weight: group.group_weight});
                  learners[learnerId].totalPossible += group.group_weight;
              }
          });
      });
  });

  const finalOutput = Object.values(learners).map(learner => {
      let totalWeightedScore = 0;
      learner.scores.forEach(score => {
          totalWeightedScore += score.percentage * (score.weight / 100);
      });

      const avg = totalWeightedScore / learner.totalPossible;
      learner.avg = avg;

      delete learner.scores;
      delete learner.totalWeightedScores;
      delete learner.totalPossible;

      return learner;
  });

  return finalOutput;
}

// Example usage (using the same structure as the Python example)
const courseInfo = { id: 1, name: "Example Course" };
const assignmentGroups = [{
  id: 1,
  name: "Homework",
  course_id: 1,
  group_weight: 50,
  assignments: [{
      id: 101,
      name: "Homework 1",
      due_at: "2024-02-20T23:59:00",
      points_possible: 100,
  }],
}];
const learnerSubmissions = [{
  learner_id: 1,
  assignment_id: 101,
  submission: {
      submitted_at: "2024-02-20T23:00:00",
      score: 80,
  },
}];

console.log(getLearnerData(courseInfo, assignmentGroups, learnerSubmissions));
