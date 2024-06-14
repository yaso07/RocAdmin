// src/Dropdown.tsx

import { parishList } from '../utils/data';
import React from 'react';

interface DropdownProps {
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onSelect }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  return (
    <div className="mb-4">
      <select
        name="parish"
        id="parish"
        onChange={handleChange}
        className="mt-1 block w-[90%] pl-3 pr-10 py-2 text-base border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {parishList.map((parish) => (
          <option key={parish.value} value={parish.label}>
            {parish.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
