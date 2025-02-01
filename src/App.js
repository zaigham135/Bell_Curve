import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

function App() {
  // State variables for our data
  const [employees, setEmployees] = useState([]);
  const [ratingCategories, setRatingCategories] = useState([]);
  const [actualPercentages, setActualPercentages] = useState({});
  const [deviations, setDeviations] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ id: '', name: '', rating: '' });
  const [editingEmployee, setEditingEmployee] = useState(null);

  let API_URL = "http://localhost:7060";

  // Fetch all data on component mount
  useEffect(() => {
    fetchEmployees();
    fetchRatingCategories();
    fetchActualPercentages();
    fetchDeviations();
    fetchSuggestions();
  }, []);

  useEffect(() => {
    console.log("Employees State Updated:", employees);
  }, [employees]);

  // Function to fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Function to fetch rating categories
  const fetchRatingCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employees/rating-categories`);
      setRatingCategories(response.data);
    } catch (error) {
      console.error("Error fetching rating categories:", error);
    }
  };

  // Function to fetch actual percentages
  const fetchActualPercentages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employees/actual-percentages`);
      setActualPercentages(response.data);
    } catch (error) {
      console.error("Error fetching actual percentages:", error);
    }
  };

  // Function to fetch deviations (actual - standard)
  const fetchDeviations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employees/deviation`);
      setDeviations(response.data);
    } catch (error) {
      console.error("Error fetching deviations:", error);
    }
  };

  // Function to fetch suggested adjustments
  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employees/suggest-adjustments`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const addEmployee = () => {
    setEmployees([...employees, { ...newEmployee, id: employees.length + 1 }]);
    setNewEmployee({ id: '', name: '', rating: '' }); // Reset form
  };

  const editEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee(employee);
  };

  const updateEmployee = () => {
    setEmployees(employees.map(emp => (emp.id === editingEmployee.id ? newEmployee : emp)));
    setNewEmployee({ id: '', name: '', rating: '' }); // Reset form
    setEditingEmployee(null);
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Employee Performance Dashboard</h1>

      {/* Stylish Employee Form */}
      <div className="mb-4 d-flex align-items-center">
        <input
          type="text"
          name="name"
          className="form-control me-2"
          placeholder="Name"
          value={newEmployee.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="rating"
          className="form-control me-2"
          placeholder="Rating"
          value={newEmployee.rating}
          onChange={handleInputChange}
        />
        <button className="btn btn-primary" onClick={editingEmployee ? updateEmployee : addEmployee}>
          {editingEmployee ? "Update Employee" : "Add Employee"}
        </button>
      </div>

      {/* Employee List Section */}
      <section className="mb-5">
        <h2>
          Employees <span className="badge bg-secondary">{employees.length}</span>
        </h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.rating}</td>
                  <td>
                    <div className="dropdown">
                      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        ...
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><button className="dropdown-item" onClick={() => editEmployee(emp)}>Edit</button></li>
                        <li><button className="dropdown-item text-danger" onClick={() => deleteEmployee(emp.id)}>Delete</button></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rating Categories Section */}
      <section className="mb-5">
        <h2>Rating Categories</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Category</th>
                <th>Standard Percentage</th>
              </tr>
            </thead>
            <tbody>
              {ratingCategories.map((cat) => (
                <tr key={cat.category}>
                  <td>{cat.category}</td>
                  <td>{cat.standardPercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Actual Percentages Section */}
      <section className="mb-5">
        <h2>Actual Percentages</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Category</th>
                <th>Actual Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(actualPercentages).map(([category, percentage]) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>{percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Deviations Section */}
      <section className="mb-5">
        <h2>Deviation (Actual - Standard)</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Category</th>
                <th>Deviation</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(deviations).map(([category, deviation]) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>{deviation.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Suggested Adjustments Section */}
      <section className="mb-5">
        <h2>Suggested Adjustments</h2>
        <p>
          {suggestions.length > 0
            ? `Suggested adjustments for ${suggestions.length} employee(s).`
            : "No adjustments needed."}
        </p>
        {suggestions.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
