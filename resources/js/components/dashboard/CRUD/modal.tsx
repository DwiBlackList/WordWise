import React, { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (formData: {
    name: string;
    bio: string;
    details: string[];
  }) => void;
  initialData?: {
    name: string;
    bio: string;
    details: string[];
  };
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [details, setDetails] = useState<string[]>(["", "", "", ""]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setBio(initialData.bio);
      setDetails(initialData.details);
    }
  }, [initialData]);

  const handleDetailChange = (index: number, value: string) => {
    const updatedDetails = [...details];
    updatedDetails[index] = value;
    setDetails(updatedDetails);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        {/* Name and Bio Input */}
        <div className="flex items-center mb-4">
          <div className="h-16 w-16 bg-gray-300 rounded-full flex-shrink-0"></div>
          <div className="ml-4 w-full">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter name"
            />
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="text-gray-500 rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mt-1"
              placeholder="Enter bio"
            />
          </div>
        </div>

        {/* Details Input */}
        <div className="space-y-4">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-center">
              <label className="text-gray-600 flex-shrink-0 w-20">
                Details
              </label>
              <input
                type="text"
                value={detail}
                onChange={(e) => handleDetailChange(idx, e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Value"
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 focus:ring focus:ring-pink-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ name, bio, details })}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
