function NotFound() {
    return (
      <div 
        className="not-found" 
        style={{ 
          textAlign: "center",
          padding: "120px 20px", // Increased top padding
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <h1>Oops! 404 Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <button
          onClick={() => window.location.href = "/"}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Go back to home
        </button>
      </div>
    );
  }
  
  export default NotFound;
  