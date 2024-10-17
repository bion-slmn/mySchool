import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cards.css";
import ProgressBar from "./progressBar";

const GradeandFees = ({ data, feeType }) => {
  const navigate = useNavigate();

  // Navigate to fee details page when the card is clicked
  const handleCardClick = (feeId, feeName, feeToPay, total_students) => {
    if (total_students) {
      navigate(`/fee/${feeName}/${feeId}/${feeToPay}`);
    }
  };

  // Calculate the percentage of fee paid for each fee
  const calculatePercentage = (fee) => {
    const total_paid = fee.fees__total_paid || fee.total_paid;
    const total_amount = fee.total_amount || fee.fees__total_amount;
    const students = fee.total_students;

    if (students === 0 && feeType !== "ADMISSION") {
      return 0;
    }

    return ((total_paid / (total_amount * students)) * 100).toFixed(2);
  };

  // Calculate the total amount paid for a grade
  const calculateTotalPaidForGrade = (fees) => {
    if (feeType === "ADMISSION") {
      return fees.total_paid + "/" + fees.total_amount;
    }

    const fee_paid = fees
      .reduce((total, fee) => total + fee.fees__total_paid, 0)
      .toFixed(2);

    const fee_total = fees
      .reduce(
        (total, fee) => total + fee.fees__total_amount * fee.total_students,
        0
      )
      .toFixed(2);

    return fee_paid + " / " + fee_total;
  };

  return (
    <div className="container">
      {Object.entries(data).map(([gradeName, fees], index) => (
        <div key={gradeName}>
          <div className="gradeSection">
            {/* Display the grade name */}
            <h4 className="gradeTitle">{gradeName}</h4>

            {/* Calculate and display the total amount paid for this grade */}
            <p className="gradeTotal">
              Total Paid for {gradeName}: Kshs{" "}
              {calculateTotalPaidForGrade(fees)}
            </p>

            <div className="cardsContainer">
              {fees.map((fee) => (
                <div
                  key={fee.fees__id || fee.id}
                  className="card"
                  onClick={() =>
                    handleCardClick(
                      fee.fees__id,
                      fee.fees__name,
                      fee.fees__total_amount,
                      fee.total_students
                    )
                  }
                >
                  <div className="cardContent">
                    <p>
                      {`${
                        fee.fees__name
                      } | Kshs ${fee.fees__total_amount.toFixed(2)} | ${
                        fee.total_students
                      } students`}
                    </p>

                    {/* Progress bar to show percentage paid */}
                    <ProgressBar completed={calculatePercentage(fee)} />
                  </div>

                  <div className="total">
                    {/* Display paid amount and total amount to be received */}
                    <p>
                      Paid: Kshs{" "}
                      {`${fee.fees__total_paid.toFixed(2)} / ${(
                        fee.fees__total_amount * fee.total_students
                      ).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {index < Object.entries(data).length - 1 && <hr />}{" "}
          {/* Add line between grades */}
        </div>
      ))}
    </div>
  );
};

export default GradeandFees;
