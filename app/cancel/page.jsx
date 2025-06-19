export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Cancelled</h1>
      <p className="text-lg text-gray-700">You cancelled the payment. No credits were added.</p>
    </div>
  );
}
