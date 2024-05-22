import React, { useState, useEffect } from 'react';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firebase configuration

const NpsSurveyComponent = ({ username }) => {
  const [surveyResult, setSurveyResult] = useState(null);

  useEffect(() => {
    Survey.StylesManager.applyTheme("default");
  }, []);

  // Define your NPS survey JSON
  const surveyJSON = {
    title: "Net Promoter Score Survey",
    questions: [
      {
        type: "nps",
        name: "likelihood",
        title: "How likely are you to recommend our product or service to a friend or colleague?",
        isRequired: true,
        minRateDescription: "Not likely",
        maxRateDescription: "Extremely likely"
      }
    ]
  };

  // Define a callback for survey completion
  const onCompleteSurvey = async (survey) => {
    // Access survey data here
    console.log("Survey results:", survey.data);

    // Add the survey data to the database
    try {
      const surveyData = {
        username: username,
        npsScore: survey.data.likelihood,
        timestamp: new Date()
      };
      const docRef = await addDoc(collection(db, 'npsSurveys'), surveyData);
      console.log("Survey data added with ID: ", docRef.id);
      setSurveyResult("Thank you for completing the survey!");
    } catch (error) {
      console.error("Error adding survey data: ", error);
      setSurveyResult("An error occurred while processing your survey. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Net Promoter Score Survey</h2>
      {surveyResult && <p>{surveyResult}</p>}
      <Survey.Survey
        json={surveyJSON}
        onComplete={onCompleteSurvey}
      />
    </div>
  );
};

export default NpsSurveyComponent;
