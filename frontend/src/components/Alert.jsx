const Alert = ({ type = "info", message, onClose }) => {
  const typeStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  const iconStyles = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  if (!message) return null;

  return (
    <div
      className={`border-l-4 p-4 mb-4 rounded ${typeStyles[type]} flex items-center justify-between`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="font-bold mr-2">{iconStyles[type]}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-lg font-bold opacity-70 hover:opacity-100"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
