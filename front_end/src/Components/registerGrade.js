import { useEffect, useState } from "react";
import { useFormSubmit, HandleResult } from "./form";
import "../styles/form.css";
import SubmitButton from "./submitButton";
import Error from "./error";

const RegisterGrade = () => {
  const [name, setName] = useState("");
  const [description, setdescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const { handleSubmit, error } = useFormSubmit(
    "api/school/create-grade/",
    { name, description },
    () => {
      setSubmitted(true);
      setErrors("");
    },
    true,
    setIsLoading
  );

  useEffect(() => {
    <HandleResult error={error} />;
  }, [error]);

  return (
    <div className="Register">
      <h2>Register a Grade</h2>
      <button className="menu grade" onClick={() => setShowForm(!showForm)}>
        Click To Add a Grade
      </button>

      {/* Conditionally render the fo   rm based on state */}
      {showForm && (
        <form onSubmit={handleSubmit} className="GradeForm">
          <label>Grade Name</label>
          <input
            type="text"
            placeholder="Grade/Class 4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Description of Grade</label>
          <input
            type="text"
            placeholder="Brief discription Grade"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            required
          />
          <SubmitButton text="Add the Grade" isLoading={isLoading} />
        </form>
      )}
      {error && <Error error={error} />}
      {submitted && <HandleResult error={error} />}
    </div>
  );
};

export default RegisterGrade;
