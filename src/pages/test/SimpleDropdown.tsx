import   { useState } from "react";
import { SimpleDropdown } from "../../components/headlessUI/SimpleDropdown";
import { sortOptions } from "../../data/options";

export const TestSimpleDropdown = () => {
  const [selected, setSelected] = useState("");

  return (
    <div>
      <h1>Simple Dropdown</h1>
      <SimpleDropdown
        value={selected}
        onChange={setSelected}
        options={sortOptions}
        label="Sort by"
      />
    </div>
  );
};
