// Patient Tracker Model for MongoDB
class PatientTracker {
  constructor(data) {
    this.patientId = data.patientId;
    this.procedureType = data.procedureType || 'myomectomy';
    this.symptoms = data.symptoms || [];
    this.notes = data.notes || '';
    this.painLevel = data.painLevel; // 1-10 scale
    this.medications = data.medications || [];
    this.timestamp = data.timestamp || new Date();
    this.followUpNeeded = data.followUpNeeded || false;
    this.warningSignsPresent = data.warningSignsPresent || false;
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.patientId) {
      errors.push('Patient ID is required');
    }
    
    if (this.painLevel && (this.painLevel < 1 || this.painLevel > 10)) {
      errors.push('Pain level must be between 1 and 10');
    }
    
    if (!Array.isArray(this.symptoms)) {
      errors.push('Symptoms must be an array');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Convert to MongoDB document format
  toDocument() {
    return {
      patientId: this.patientId,
      procedureType: this.procedureType,
      symptoms: this.symptoms,
      notes: this.notes,
      painLevel: this.painLevel,
      medications: this.medications,
      timestamp: this.timestamp,
      followUpNeeded: this.followUpNeeded,
      warningSignsPresent: this.warningSignsPresent
    };
  }

  // Static method to create from MongoDB document
  static fromDocument(doc) {
    return new PatientTracker({
      patientId: doc.patientId,
      procedureType: doc.procedureType,
      symptoms: doc.symptoms,
      notes: doc.notes,
      painLevel: doc.painLevel,
      medications: doc.medications,
      timestamp: doc.timestamp,
      followUpNeeded: doc.followUpNeeded,
      warningSignsPresent: doc.warningSignsPresent
    });
  }
}

module.exports = PatientTracker;
