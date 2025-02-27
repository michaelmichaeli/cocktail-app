import { useEffect, useState, useCallback } from "react";
import { useBeforeUnload, useNavigate } from "react-router-dom";

interface UseFormNavigationProps {
  isDirty: boolean;
  onLeave?: () => void;
}

export function useFormNavigation({ isDirty, onLeave }: UseFormNavigationProps) {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeNavigate = (event: Event) => {
      if (isDirty) {
        const e = event as PopStateEvent;
        e.preventDefault();
        setPendingPath(window.location.pathname);
        setShowDialog(true);
      }
    };

    window.addEventListener("popstate", handleBeforeNavigate);
    return () => window.removeEventListener("popstate", handleBeforeNavigate);
  }, [isDirty]);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (isDirty) {
          event.preventDefault();
          event.returnValue = "";
        }
      },
      [isDirty]
    )
  );

  const handleClose = () => {
    setShowDialog(false);
    setPendingPath(null);
  };

  const handleConfirm = () => {
    setShowDialog(false);
    onLeave?.();
    if (pendingPath) {
      navigate(pendingPath);
    } else {
      navigate("/");
    }
  };

  return {
    showDialog,
    handleClose,
    handleConfirm,
  };
}
