import React from "react";
import { fetchData } from "./form";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/table.css";

const FeeAndPayment = () => {
  const { feeId, feeName, feeToPay } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = (feeId, feeName, studentID) => {
    navigate(`/payments/${feeName}/${feeId}/${studentID}`);
  };

  React.useEffect(() => {
    const fetchFeeData = async () => {
      setIsLoading(true);
      try {
        const url = `http://localhost:8000/api/school/payment-on-fee/${feeId}/`;
        const [data, urlError] = await fetchData("GET", url);
        if (urlError) {
          navigate("/login");
          console.error(urlError);
          setError(urlError);
        } else {
          setData(data);
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeeData();
  }, [feeId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    return <p>No data available</p>;
  }

  const calculateFeeBalance = (feeToPay, payments) => {
    let res = feeToPay - payments.amount;
    return res;
  };

  return (
    <div className="feecontainer">
      <table className="payment-table">
        <caption>Fees and Payments for {feeName}</caption>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Payments</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([studentName, payments]) => (
            <tr
              key={payments.student_id}
              onClick={() => {
                handleClick(feeId, feeName, payments.student_id);
              }}
            >
              <td data-label="Student Name">{studentName}</td>
              <td data-label="Payments">{payments.amount}</td>
              <td data-label="Balance">
                {calculateFeeBalance(feeToPay, payments)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeAndPayment;
