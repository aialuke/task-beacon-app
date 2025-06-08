import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useMobileViewport } from "@/hooks/useMobileViewport";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    style={{
      backgroundColor: "rgb(0 0 0 / 80%)",
    }}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { keyboardVisible, availableHeight } = useMobileViewport();
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [modalHeight, setModalHeight] = React.useState<number>(0);
  const [isStandalone, setIsStandalone] = React.useState<boolean>(false);
  const [safeAreaTop, setSafeAreaTop] = React.useState<number>(0);

  const combinedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      modalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  React.useEffect(() => {
    const standalone =
      "standalone" in window.navigator ? window.navigator.standalone : false;
    setIsStandalone(!!standalone);
    const sat =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--sat")
      ) || 0;
    setSafeAreaTop(sat);
  }, []);

  React.useEffect(() => {
    if (modalRef.current) {
      const height = modalRef.current.offsetHeight;
      setModalHeight(height);
    }
  }, [children]);

  const getModalPosition = React.useCallback(() => {
    if (!keyboardVisible) {
      return {
        top: "50%",
        transform: "translate(-50%, -50%)",
        maxHeight: "90vh",
      };
    }
    const modalMaxHeight = Math.min(availableHeight * 0.7, 400);
    let topPosition = availableHeight * (isStandalone ? 0.55 : 0.61);
    if (isStandalone) {
      topPosition += safeAreaTop;
    }
    return {
      top: `${Math.max(40, topPosition)}px`,
      transform: "translateX(-50%)",
      maxHeight: `${modalMaxHeight}px`,
    };
  }, [keyboardVisible, availableHeight, isStandalone, safeAreaTop]);

  const modalStyle = getModalPosition();

  React.useEffect(() => {
    const updatePosition = () => {
      if (keyboardVisible && modalRef.current) {
        const updatedStyle = getModalPosition();
        modalRef.current.style.top = updatedStyle.top;
        modalRef.current.style.transform = updatedStyle.transform;
        modalRef.current.style.maxHeight = updatedStyle.maxHeight;
      }
    };
    updatePosition();
    const timer = setTimeout(updatePosition, 100);
    window.addEventListener("resize", updatePosition);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updatePosition);
    }
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updatePosition);
      }
    };
  }, [
    keyboardVisible,
    availableHeight,
    modalHeight,
    getModalPosition,
    isStandalone,
    safeAreaTop,
  ]);

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={combinedRef}
        className={cn(
          "fixed left-[50%] z-50 grid w-full max-w-lg gap-4 overflow-y-auto border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 sm:rounded-xl",
          keyboardVisible &&
            "data-[state=closed]:slide-out-to-top-[40px] data-[state=open]:slide-in-from-top-[40px]",
          !keyboardVisible &&
            "data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]",
          className
        )}
        style={{
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          borderColor: "#404040",
          ...modalStyle,
        }}
        {...props}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" style={{ color: "#ffffff" }} />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    style={{ color: "#ffffff" }}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm", className)}
    style={{ color: "#a3a3a3" }}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
// CodeRabbit review
