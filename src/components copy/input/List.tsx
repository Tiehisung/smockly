import { Plus, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

interface IListInput {
  defaultValues?: Array<string>;
  label?: ReactNode;
  onChange?: (values: string[]) => void;
}

const ListInput = ({
  defaultValues = [],
  label = "Tags",
  onChange,
}: IListInput) => {
  const [input, setInput] = useState("");
  const [values, setValues] = useState(defaultValues);

  const handleAddTag = () => {
    if (input.trim()) {
      const currentTags = values || [];
      setValues([...currentTags, input.trim()]);

      setInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = values;
    setValues(currentTags.filter((_, i) => i !== index));
  };

  //   Export
  useEffect(() => {
    if (onChange) onChange(values);
  }, [values]);
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {label && <h2 className="text-lg font-semibold mb-4">{label}</h2>}

      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddTag())
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a tag..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {values?.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="ml-2 hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListInput;
