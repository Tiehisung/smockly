import { Upload } from "lucide-react";
import type { FC } from "react";

interface IFileInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement, Element>) => void;
}

const FileInput: FC<IFileInputProps> = ({ onChange }) => {
  return (
    <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
      <Upload className="w-8 h-8 text-gray-400" />
      <span className="text-sm text-gray-500 mt-2">Upload</span>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
};

export default FileInput;
