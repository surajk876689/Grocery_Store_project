export default function PrintButton() {
  return (
    <>
      <style>{`
        @media print {
          nav,
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <button
        onClick={() => window.print()}
        className="no-print mt-4 bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Print Receipt
      </button>
    </>
  );
}
