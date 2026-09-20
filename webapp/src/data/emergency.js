/* Emergency blood-support demo data — identical to the shipped mobile prototype. */

export const globalEmergencyRequests = [
  { id: 1, hospital: 'Apollo Hospital', location: 'Bashundhara, Dhaka', bg: 'B+', distance: '2.3km', urgency: 'Critical', units: 2, match: 'Perfect Match', time: '10m ago', description: 'Patient is undergoing open heart surgery. Blood is required immediately.', contact: '01711223344', patientName: 'Rahim Uddin' },
  { id: 2, hospital: 'Square Hospital', location: 'Panthapath, Dhaka', bg: 'O+', distance: '5.1km', urgency: 'Needed Today', units: 1, match: 'Compatible', time: '1h ago', description: 'Accident patient in ICU. Need O+ blood by tonight.', contact: '01811223344', patientName: 'Karim Hasan' }
];

export const findEmergencyById = (id) => globalEmergencyRequests.find(r => String(r.id) === String(id)) || null;

export const bloodGroups = [
  { bg: 'A+', count: 42 }, { bg: 'B+', count: 85 }, { bg: 'O+', count: 64 }, { bg: 'AB+', count: 18 },
  { bg: 'A-', count: 12 }, { bg: 'B-', count: 23 }, { bg: 'O-', count: 15 }, { bg: 'AB-', count: 5 }
];
