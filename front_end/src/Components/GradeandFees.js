import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cards.css";
import ProgressBar from "./progressBar";

const GradeandFees = ({ data }) => {
  const navigate = useNavigate();

  const handleCardClick = (feeId, feeName, feeToPay) => {
    navigate(`/fee/${feeName}/${feeId}/${feeToPay}`);
  };

  const calculatePercentage = (fee) => {
    return (
      (fee.fees__total_paid / (fee.fees__total_amount * fee.total_students)) *
      100
    ).toFixed(2);
  };

  return (
    <div className="container">
      {Object.entries(data).map(([gradeName, fees], index) => (
        <div key={gradeName}>
          <div className="gradeSection">
            <h4 className="gradeTitle">{gradeName}</h4>
            <div className="cardsContainer">
              {fees.map((fee) => (
                <div
                  key={fee.fees__id}
                  className="card"
                  onClick={() =>
                    handleCardClick(
                      fee.fees__id,
                      fee.fees__name,
                      fee.fees__total_amount
                    )
                  }
                >
                  <div className="cardContent">
                    <p>
                      {`${fee.fees__name} | ${fee.fees__total_amount.toFixed(
                        2
                      )}`}{" "}
                      | {fee.total_students} students
                    </p>

                    <ProgressBar completed={calculatePercentage(fee)} />
                  </div>
                  <div className="total">
                    <p>
                      Paid: Kshs{" "}
                      {`${fee.fees__total_paid} / ${(
                        fee.fees__total_amount * fee.total_students
                      ).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {index < Object.entries(data).length - 1 && <hr />} {/* Add line */}
        </div>
      ))}
    </div>
  );
};

export default GradeandFees;
