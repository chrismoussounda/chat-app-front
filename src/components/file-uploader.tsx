import { useDropzone } from 'react-dropzone';
import { useEffect } from 'react';

interface FileUploadProps {
  onChange: (file: File) => void;
  type: 'server' | 'message';
}

const images = ['image/png', 'image/jpeg', 'image/gif'];
const pdf = ['application/pdf'];

export const FileUploader = ({ onChange, type }: FileUploadProps) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: type === 'server' ? { images } : { images, pdf },
    multiple: false,
    preventDropOnDocument: true,
  });

  useEffect(() => {
    if (acceptedFiles.length) onChange(acceptedFiles[0]);
  }, [acceptedFiles, acceptedFiles.length, onChange]);
  return (
    <div
      {...getRootProps()}
      className="mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center w-auto"
      role="presentation"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        className="mx-auto block h-12 w-12 align-middle text-gray-400"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765a4.5 4.5 0 0 1 8.302-3.046a3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z"
          clipRule="evenodd"
        ></path>
      </svg>
      <div className="m-0 h-[1.25rem] text-xs leading-5 text-gray-600">
        Allowed content : {type === 'message' ? 'image or pfd' : 'image'}
      </div>
      <label className="relative mt-2 flex w-64 cursor-pointer items-center justify-center text-sm font-semibold leading-6 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-700 focus-within:ring-offset-2 hover:indigo-500/90 text-indigo-700">
        Choose a file or drag and drop
        <input
          {...getInputProps()}
          multiple={false}
          type="file"
          tabIndex={-1}
          className="hidden sr-only"
          disabled
        />
      </label>
    </div>
  );
};
