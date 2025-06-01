function FailureView(props) {
  const { onRetry } = props;
  return (
    <div
      style={{ minHeight: "90vh" }}
      className="d-flex flex-column justify-content-center align-items-center text-center"
    >
      <h1 className="text-xl font-semibold mb-2">Something Went Wrong</h1>
      <p className="text-gray-600 mb-4">
        We are having some trouble fetching the data. Please try again.
      </p>
      <button onClick={onRetry} className="btn btn-primary">
        Retry
      </button>
    </div>
  );
}

export default FailureView;
