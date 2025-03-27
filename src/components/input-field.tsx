import React from "react";

interface InputProps {
  type?: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  icon?: React.ReactNode;
  isTextArea?: boolean;
  error?: string;
}

const InputField: React.FC<InputProps> = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  icon,
  isTextArea,
  error,
}) => (
  <div className="w-full">
    <div
      className={`flex items-center gap-1 rounded-md bg-white px-2 py-1 outline-1 -outline-offset-1 outline-gray-300 
      ${
        error
          ? "outline-red-500"
          : "has-[input:focus-within]:outline-indigo-600"
      }`}
    >
      {icon && <div className="text-base text-gray-500">{icon}</div>}
      {isTextArea ? (
        <textarea
          name={name}
          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          name={name}
          className="w-full block p-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default InputField;
