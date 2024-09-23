import { useState } from "react";
import { useNavigate } from "react-router-dom";

const handleErrors = (response) => {
  if (response.status === 403) {
    throw new Error("You must be the ADMIN to perform this action.");
  }

  if (response.status === 401) {
    localStorage.setItem("sHule", "");
    window.location.href = "/login";
    return;
  }
};

export const useFormSubmit = (
  endpoint,
  payload,
  onSuccess = () => {},
  includeAuth = false,
  setIsLoading = () => {}
) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = "https://myschool-ax55.onrender.com/" + endpoint;

    try {
      setIsLoading(true); // Start loading when the form is submitted

      const headers = {
        "Content-Type": "application/json",
      };

      // If includeAuth is true, add the Authorization header
      if (includeAuth) {
        headers.Authorization = `Bearer ${localStorage.getItem("sHule")}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 401) {
        console.log("failed to login............");
        localStorage.setItem("sHule", "");
        navigate("/login");
      }

      // Handle 403 Forbidden status
      if (response.status === 403) {
        throw new Error("You must be the ADMIN to perform this action.");
      }

      // Handle other errors
      if (!response.ok) {
        throw new Error(data || "An error occurred.");
      }

      if (data.access) {
        localStorage.setItem("accessToken", data.access);
      }

      setError("");
      onSuccess(); // Call the success callback
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false); // Stop loading after submission
    }
  };

  return { handleSubmit, error };
};

export const HandleResult = ({ error }) => {
  return (
    <div>
      {error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <div>Successfully added</div>
      )}
    </div>
  );
};

/**
 * Fetch data from a given URL with the specified HTTP method.
 *
 * @param {string} endpoint_method - The HTTP method (e.g., "GET", "POST").
 * @param {string} endpoint - The API endpoint URL.
 * @returns {Promise<{ data: any, urlError: string }>} - An object containing the response data and any error message.
 */
export const fetchData = async (endpoint_method, endpoint) => {
  let data = null; // Initialize data to null
  let urlError = ""; // Initialize error message to an empty string
  const url = "https://myschool-ax55.onrender.com/" + endpoint;
  console.log(url, 1212121212);

  try {
    const response = await fetch(url, {
      method: endpoint_method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sHule")}`,
        "Content-Type": "application/json",
      },
    });

    handleErrors(response);

    data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "An error occurred");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    urlError = error.message;
  }

  return [data, urlError]; // Return both data and urlError
};
