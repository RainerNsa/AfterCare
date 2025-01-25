// Brochure content data structure for different procedures
const brochures = {
  myomectomy: {
    title: "Myomectomy Post-Operative Care Instructions",
    lastUpdated: "2025-01-25",
    activityRestrictions: [
      "Lifting: Avoid lifting more than 1 gallon of milk (approximately 8 lbs) for 4-6 weeks",
      "Driving: Restricted until pain medications are discontinued and you can safely operate a vehicle",
      "Intercourse: No sexual activity for 6 weeks to allow proper healing",
      "Exercise: No strenuous exercise or heavy lifting for 4-6 weeks",
      "Work: Return to desk work when comfortable, typically 1-2 weeks; physical work may require 4-6 weeks",
      "Stairs: Limit stair climbing for the first week; use handrails when necessary",
      "Bathing: Showers only for first 48 hours; avoid baths until incision is fully healed"
    ],
    painManagement: [
      "Take prescribed pain medications as directed by your physician",
      "Use stool softeners if experiencing constipation from pain medications",
      "Apply ice packs to incision area for 15-20 minutes every 2-3 hours for first 48 hours",
      "Take medications with food to prevent stomach upset",
      "Do not exceed recommended dosages",
      "Gradually reduce pain medication as discomfort decreases",
      "Contact your doctor if pain is not controlled with prescribed medications"
    ],
    warningSigns: [
      "Fever greater than 100.4°F (38°C)",
      "Heavy bleeding requiring more than one pad per hour",
      "Severe unrelieved abdominal pain",
      "Signs of infection: increased redness, warmth, swelling, or drainage from incision",
      "Persistent nausea and vomiting",
      "Difficulty urinating or inability to urinate",
      "Shortness of breath or chest pain",
      "Leg swelling or pain (possible blood clot)",
      "Unusual vaginal discharge with foul odor"
    ],
    followUpSchedule: {
      "postOpAppointment": "Post-operative appointment scheduled at 4-6 weeks",
      "urgentCare": "Contact office immediately if warning signs occur",
      "routineQuestions": "Call office during business hours for routine questions"
    },
    healingTimeline: {
      "fullRecovery": "Full recovery typically takes 4-6 weeks",
      "dischargeTime": "Hospital discharge usually occurs 4-8 hours after procedure for outpatient cases",
      "returnToNormalActivity": "Gradual return to normal activities over 4-6 weeks",
      "incisionHealing": "Incision should heal within 2-3 weeks"
    },
    dietaryGuidelines: [
      "Start with clear liquids and advance to regular diet as tolerated",
      "Increase fiber intake to prevent constipation",
      "Stay well hydrated - drink 8-10 glasses of water daily",
      "Avoid alcohol while taking pain medications",
      "Take iron supplements if recommended by your doctor"
    ],
    incisionCare: [
      "Keep incision clean and dry",
      "Gently wash with soap and water during shower",
      "Pat dry - do not rub the incision area",
      "Do not apply lotions, creams, or ointments unless prescribed",
      "Wear loose, comfortable clothing to avoid irritation",
      "Remove surgical tape/strips as directed by your surgeon"
    ]
  }
};

module.exports = brochures;
