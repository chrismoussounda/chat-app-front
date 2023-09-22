import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Loader2 className="animate-spin h-10 w-10" />
    </div>
  );
};

export default Loader;
