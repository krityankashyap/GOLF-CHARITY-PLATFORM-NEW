import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-forest-800 group-[.toaster]:text-white group-[.toaster]:border-forest-700 group-[.toaster]:shadow-xl',
          description: 'group-[.toast]:text-gray-400',
          actionButton: 'group-[.toast]:bg-gold-500 group-[.toast]:text-forest-900',
          cancelButton: 'group-[.toast]:bg-forest-700 group-[.toast]:text-gray-300',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
