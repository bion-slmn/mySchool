import { useNavigate } from "react-router-dom";
import { useFormSubmit, HandleResult, fetchData } from "./form";
import { useState, useEffect } from "react";
import "../styles/form.css";

const RegisterPayment = () => {
  const [formData, setFormData] = useState({
    amount: "",
    date_paid: "",
    payment_method: "",
    reference_number: "",
    fee: "",
    student: "",
    grade: "",
  });

  const [fees, setFees] = useState([]); // To store fees fetched from the API
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  let { handleSubmit, error } = useFormSubmit(
    "http://localhost:8000/api/school/create-payment/",
    formData, // Pass formData directly
    () => {
      setSubmitted(true);
    },
    true
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowForm = async () => {
    const url = `http://localhost:8000/api/school/view-all-grades/`;

    try {
      const [data, urlError] = await fetchData("GET", url);

      if (urlError) {
        navigate("/login");
        error = urlError;
      } else {
        console.log(data); // Check data and urlError
        setGrades(data);
        setShowForm(!showForm); // Set showForm to true after grades are fetched
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
    }
  };

  useEffect(() => {
    if (formData.grade) {
      const fetchStudent = async () => {
        try {
          const url = `http://localhost:8000/api/school/students-in-grade/${formData.grade}/`;
          const [data, urlError] = await fetchData("GET", url);
          if (urlError) {
            throw new Error(urlError);
          }
          setStudents(data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchStudent();
    }
  }, [formData.grade]);

  useEffect(() => {
    if (formData.grade) {
      const fetchFees = async () => {
        try {
          const url = `http://localhost:8000/api/school/fees-in-grade/${formData.grade}/`;
          const [data, urlError] = await fetchData("GET", url);
          if (urlError) {
            throw new Error(urlError);
          }

          setFees(data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchFees();
    }
  }, [formData.grade]);

  return (
    <div className="StudentRegister">
      <h2>Register a Payment</h2>
      <span className="menu payment" onClick={handleShowForm}>
        Click to register a payment
      </span>

      {showForm && (
        <form onSubmit={handleSubmit} className="StudentForm">
          <label>Grade</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Grade</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </select>
          <label>Select Student Name</label>
          <select
            name="student"
            value={formData.student}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <label>Select Fee</label>
          <select
            name="fee"
            value={formData.fee}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Fee</option>
            {fees.map((fee) => (
              <option key={fee.id} value={fee.id}>
                {fee.name}
              </option>
            ))}
          </select>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
          <label>Date of Payment</label>
          <input
            type="date"
            name="date_paid"
            value={formData.date_paid}
            onChange={handleInputChange}
            required
          />
          <label>Payment Method</label>
          <input
            type="text"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleInputChange}
            required
          />
          <label>Reference number</label>
          <input
            type="text"
            name="reference_number"
            value={formData.reference_number}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Register Payment</button>
        </form>
      )}

      {submitted && <HandleResult error={error} />}
    </div>
  );
};

export default RegisterPayment;