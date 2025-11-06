import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AndroidBackButtonProps {
  /** Text to display next to the back icon (optional, defaults to none) */
  label?: string;
  /** Navigation path when clicked. If not provided, uses navigate(-1) for native back behavior */
  to?: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Custom className for styling */
  className?: string;
}

/**
 * Android Material Design compliant back button component
 * 
 * Guidelines followed:
 * - Minimum touch target: 48dp (12px = 3rem in Tailwind)
 * - Icon size: 24dp (6px = 1.5rem in Tailwind)
 * - Proper padding and spacing
 * - Respects safe areas for notched devices
 * - Consistent placement (top-left)
 */
export const AndroidBackButton = ({ 
  label, 
  to, 
  onClick, 
  className = "" 
}: AndroidBackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1); // Native Android back behavior
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={label || "Go back"}
      title={label || "Go back"}
      className={`
        inline-flex items-center gap-2
        min-h-[48px] min-w-[48px] px-3 py-3
        text-gray-700 hover:text-gray-900
        hover:bg-gray-100 active:bg-gray-200
        rounded-full transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
        touch-manipulation
        ${className}
      `}
    >
      <ArrowLeft 
        className="w-6 h-6" 
        strokeWidth={2}
        aria-hidden="true"
      />
      {label && (
        <span className="text-base font-medium">
          {label}
        </span>
      )}
    </button>
  );
};

/**
 * Android Material Design compliant page header with back button
 * 
 * This component provides a consistent header layout across all pages
 * following Android Material Design guidelines.
 */
interface AndroidPageHeaderProps {
  /** Page title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Navigation path for back button. If not provided, uses navigate(-1) */
  backTo?: string;
  /** Optional click handler for back button */
  onBack?: () => void;
  /** Optional right-side content (actions, buttons, etc.) */
  rightContent?: React.ReactNode;
  /** Custom className */
  className?: string;
}

export const AndroidPageHeader = ({
  title,
  subtitle,
  backTo,
  onBack,
  rightContent,
  className = ""
}: AndroidPageHeaderProps) => {
  return (
    <header className={`
      bg-white/95 backdrop-blur-sm
      border-b border-gray-200/50
      sticky top-0 z-40
      safe-area-top
      shadow-sm
      ${className}
    `}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between min-h-[56px] py-2">
          {/* Left: Back Button */}
          <div className="flex items-center min-w-[48px]">
            <AndroidBackButton to={backTo} onClick={onBack} />
          </div>

          {/* Center: Title */}
          <div className="flex-1 text-center px-4">
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right: Actions or Spacer */}
          <div className="flex items-center justify-end min-w-[48px]">
            {rightContent || <div className="w-12" />}
          </div>
        </div>
      </div>
    </header>
  );
};


