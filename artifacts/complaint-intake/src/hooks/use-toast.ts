import { useCallback, useState } from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

type ToastEntry = ToastProps & {
  id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((props: ToastProps) => {
    const id = Date.now() + Math.random();
    const entry: ToastEntry = {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) {
          dismissToast(id);
        }
      },
    };

    setToasts((prev) => [...prev, entry]);

    if (props.variant === "destructive") {
      sonnerToast.error(props.title, { description: props.description });
    } else {
      sonnerToast.success(props.title, { description: props.description });
    }
  }, [dismissToast]);

  return { toast, toasts };
}
