import Application from '../models/application.model.js';

// Get all applications for logged-in user
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({ deadline: 1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new application for logged-in user
export const createApplication = async (req, res) => {
  try {
    const newApp = new Application({ ...req.body, user: req.user.id });
    await newApp.save();
    res.status(201).json(newApp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update application by ID, only if owned by user
export const updateApplication = async (req, res) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },  // Ensure ownership
      req.body,
      { new: true }
    );

    if (!app) return res.status(404).json({ message: 'Application not found' });

    res.json(app);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete application by ID, only if owned by user
export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!app) return res.status(404).json({ message: 'Application not found' });

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
