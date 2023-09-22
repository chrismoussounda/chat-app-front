import { FileIcon, X } from 'lucide-react';
import { Image } from './image';
import { FileUploader } from './file-uploader';
import { cn, processPdf } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Loading } from './loading';
import { Badge } from './ui/badge';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  value: File & {
    url?: string;
  };
  disable: boolean;
  type: 'server' | 'message';
}

export const FileUpload = ({ onChange, value: file, disable, type }: FileUploadProps) => {
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState<number | null>(null);
  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      onChange(file);
    };
    reader.readAsDataURL(file);
  };
  console.log({ contentFile, file, pageNumber });

  useEffect(() => {
    if (file && file.size > 0 && file.type.includes('pdf')) {
      (async () => {
        const { imageFile, pages } = await processPdf(file);
        setContentFile(imageFile);
        setPageNumber(pages);
      })();
    }
  }, [file]);

  useEffect(() => {
    if (!file || file.size === 0) {
      setContentFile(null);
      setPageNumber(null);
    }
  }, [file]);

  const Button = ({ isPdf = false }) => (
    <button
      disabled={disable}
      onClick={() => {
        onChange(new File([''], 'filename'));
      }}
      className={cn(
        'bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm',
        disable && 'bg-rose-300',
        isPdf && 'translate-x-1/2 -translate-y-1/2'
      )}
      type="button"
    >
      <X className="h-4 w-4" />
    </button>
  );

  const isPdf = file?.type?.includes('pdf');
  if (file && (file.size > 0 || file.url) && !isPdf) {
    return type === 'server' ? (
      <div className="relative h-20 w-20 mx-auto">
        <Image
          src={file.url ? file.url : URL.createObjectURL(file)}
          alt="Image"
          className="rounded-full"
        />
        <Button />
      </div>
    ) : (
      <div className="relative mx-auto flex items-center p-2 mt-2 rounded-md bg-background/10">
        <div className=" max-h-96 h-auto overflow-scroll">
          <Image src={URL.createObjectURL(file)} alt="Image" className="rounded-md" />
        </div>
        <Button isPdf />
      </div>
    );
  }
  if (file && file.size > 0 && isPdf) {
    return (
      <div className="relative flex flex-col items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={URL.createObjectURL(file)}
          target="_blank"
          rel="noopener noreferer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {file.name}
        </a>
        <div className="h-80 flex justify-center items-center relative my-4">
          {contentFile ? (
            <>
              <Image src={URL.createObjectURL(contentFile)} alt="Image" className="rounded-md " />
              <Badge className="absolute bottom-0 translate-y-1/2 ">
                {pageNumber && `${pageNumber} page${pageNumber > 1 && 's'}`}
              </Badge>
            </>
          ) : (
            <Loading name="preview" />
          )}
        </div>
        <Button isPdf />
      </div>
    );
  }

  return <FileUploader onChange={onFile} type={type} />;
};
