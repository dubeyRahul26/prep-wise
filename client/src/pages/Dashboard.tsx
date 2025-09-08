import { useEffect, useState } from "react";
import { useApplicationStore } from "../store/useApplicationStore";
import Modal from "../components/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type StatusType = "Applied" | "Interviewing" | "Rejected" | "Offer";

interface FormData {
  title: string;
  company: string;
  link: string;
  applicationDate: Date | null;
  deadline: Date | null;
  status: StatusType;
  notes: string;
}

interface JobApplication {
  _id: string;
  title: string;
  company: string;
  link?: string;
  applicationDate?: string;
  deadline?: string;
  status: StatusType;
  notes?: string;
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const Dashboard = () => {
  const {
    applications,
    fetchApplications,
    deleteApplication,
    addApplication,
    updateApplication,
  } = useApplicationStore();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingApp, setEditingApp] = useState<
    (FormData & { _id?: string }) | null
  >(null);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    company: "",
    link: "",
    applicationDate: null,
    deadline: null,
    status: "Applied",
    notes: "",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleEdit = (app: JobApplication) => {
    setEditingApp({
      _id: app._id,
      title: app.title || "",
      company: app.company || "",
      link: app.link || "",
      applicationDate: app.applicationDate
        ? new Date(app.applicationDate)
        : null,
      deadline: app.deadline ? new Date(app.deadline) : null,
      status: app.status,
      notes: app.notes || "",
    });
    setFormData({
      title: app.title || "",
      company: app.company || "",
      link: app.link || "",
      applicationDate: app.applicationDate
        ? new Date(app.applicationDate)
        : null,
      deadline: app.deadline ? new Date(app.deadline) : null,
      status: app.status,
      notes: app.notes || "",
    });
    setShowFormModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      applicationDate: formData.applicationDate?.toISOString() || "",
      deadline: formData.deadline?.toISOString() || "",
    };

    if (editingApp?._id) {
      await updateApplication(editingApp._id, payload);
      setEditingApp(null);
    } else {
      await addApplication(payload);
    }

    setShowFormModal(false);
    setFormData({
      title: "",
      company: "",
      link: "",
      applicationDate: null,
      deadline: null,
      status: "Applied",
      notes: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-500 p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-3 sm:gap-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 text-center sm:text-left mb-3">
          Job Application Tracker
        </h1>
        <button
          onClick={() => {
            setEditingApp(null);
            setFormData({
              title: "",
              company: "",
              link: "",
              applicationDate: null,
              deadline: null,
              status: "Applied",
              notes: "",
            });
            setShowFormModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-md text-base sm:text-lg transition transform hover:scale-105 w-full sm:w-auto"
        >
          + Add New Application
        </button>
      </header>

      {/* Job Cards */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {applications.map((app: JobApplication) => (
          <div
            key={app._id}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-105 flex flex-col justify-between cursor-pointer"
            onClick={() => setSelectedApp(app)}
          >
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold truncate">
                {app.title}
              </h2>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium truncate">
                {app.company}
              </p>
              {app.link && <p className="text-blue-500 truncate">Job Link</p>}
              <p className="text-sm sm:text-base">
                <strong>Status:</strong>{" "}
                <span className="capitalize">{app.status}</span>
              </p>
              <p className="text-sm sm:text-base">
                <strong>Applied On:</strong> {formatDate(app.applicationDate)}
              </p>
              {app.deadline && (
                <p className="text-sm sm:text-base">
                  <strong>Deadline:</strong> {formatDate(app.deadline)}
                </p>
              )}
              {app.notes && (
                <p className="mt-1 text-sm sm:text-base line-clamp-2">
                  <strong>Notes:</strong> {app.notes}
                </p>
              )}
            </div>

            {/* Buttons on card */}
            <div className="flex justify-end gap-2 sm:gap-3 mt-4 flex-wrap">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(app);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow text-sm sm:text-base w-full sm:w-auto"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteApplication(app._id);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow text-sm sm:text-base w-full sm:w-auto"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Add/Edit Modal */}
      {showFormModal && (
        <Modal onClose={() => setShowFormModal(false)}>
          <div className="flex flex-col h-full sm:h-auto max-h-[90vh] w-full overflow-y-auto p-4 sm:p-6 scrollbar-none">
            <h2 className="text-2xl sm:text-3xl font-semibold text-indigo-600 mb-5">
              {editingApp ? "Edit Job Application" : "New Job Application"}
            </h2>
            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Link
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application Date
                </label>
                <DatePicker
                  selected={formData.applicationDate}
                  onChange={(date: Date | null) =>
                    setFormData({ ...formData, applicationDate: date })
                  }
                  dateFormat="dd-MM-yyyy"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholderText="Select a date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deadline
                </label>
                <DatePicker
                  selected={formData.deadline}
                  onChange={(date: Date | null) =>
                    setFormData({ ...formData, deadline: date })
                  }
                  dateFormat="dd-MM-yyyy"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholderText="Select a date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as StatusType,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offer">Offer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                  rows={4}
                  placeholder="Add any relevant notes..."
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
                >
                  {editingApp ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* View-only Modal */}
      {selectedApp && (
        <Modal onClose={() => setSelectedApp(null)}>
          <div className="max-h-[80vh] w-full overflow-y-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md space-y-4 scrollbar-none">
            <div className="p-4 space-y-3">
              <h2 className="text-2xl font-semibold">{selectedApp.title}</h2>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                {selectedApp.company}
              </p>
              {selectedApp.link && (
                <a
                  href={selectedApp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Job Link
                </a>
              )}
              <p>
                <strong>Status:</strong> {selectedApp.status}
              </p>
              <p>
                <strong>Applied On:</strong>{" "}
                {formatDate(selectedApp.applicationDate)}
              </p>
              {selectedApp.deadline && (
                <p>
                  <strong>Deadline:</strong> {formatDate(selectedApp.deadline)}
                </p>
              )}
              {selectedApp.notes && (
                <p>
                  <strong>Notes:</strong> {selectedApp.notes}
                </p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
