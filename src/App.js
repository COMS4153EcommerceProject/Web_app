function App() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Ecommerce System</h1>
      <p>Frontend placeholder — API integration coming in future sprints.</p>

      <button
        onClick={() => {
          fetch("http://<YOUR_MICROSERVICE_IP>:8080/health")
            .then(res => res.text())
            .then(data => alert("Backend says: " + data))
            .catch(() => alert("Backend not reachable yet"));
        }}
      >
        Test Backend Connection
      </button>
    </div>
  );
}

export default App;
