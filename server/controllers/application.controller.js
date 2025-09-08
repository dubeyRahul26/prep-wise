import Application from '../models/application.model.js';

// Get all applications
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ deadline: 1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new application
export const createApplication = async (req, res) => {
  try {
    const newApp = new Application(req.body);
    await newApp.save();
    res.status(201).json(newApp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update application by ID
export const updateApplication = async (req, res) => {
  try {
    const updatedApp = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedApp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete application by ID
export const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
