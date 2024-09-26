import React, { useState, useEffect } from "react";
import { fetchData } from "./form";

import React, { useState, useEffect } from "react";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false); // To trigger search on Enter

  useEffect(() => {
    const fetchSearch = async () => {
      if (searchInput.trim() === "") {
        return;
      }

      try {
        const url = `api/school/search/?search=${searchInput}`;
        const [data, error] = await fetchData("GET", url);
        if (error) {
          console.log(error);
          return;
        }
        console.log(data, "data");
      } catch (err) {
        console.error(err);
      }
    };

    if (triggerSearch) {
      fetchSearch();
      setTriggerSearch(false); // Reset trigger after search
    }
  }, [triggerSearch, searchInput]);

  const handleChange = (e) => {
    setSearchInput(e.target.value); // Update the search input value
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setTriggerSearch(true); // Trigger the search when Enter is pressed
    }
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={handleChange}
        onKeyUp={handleKeyPress} // Listen for Enter key press
      />
    </div>
  );
};

export default SearchBar;
