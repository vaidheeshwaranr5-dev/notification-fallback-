
import { useState } from "react";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const primarySuccess = events.filter(
    (event) => event.status === "PRIMARY_ACCEPTED"
  ).length;

  const fallbackSuccess = events.filter(
    (event) => event.status === "FALLBACK_ACCEPTED"
  ).length;

  const failures = events.filter(
    (event) => event.status === "ALL_CHANNELS_FAILED"
  ).length;

  function runTest(forceFailure) {
    setLoading(true);

    // Simulated workflow: no real email or SMS is sent.
    setTimeout(() => {
      const eventId = "EVT-" + Date.now().toString().slice(-6);

      const newEvent = {
        id: eventId,
        message: forceFailure
          ? "Controlled primary failure"
          : "Primary delivery test",
        primary: forceFailure ? "EMAIL · FAILED" : "EMAIL",
        fallback: forceFailure ? "TEST FALLBACK" : "NOT NEEDED",
        status: forceFailure
          ? "FALLBACK_ACCEPTED"
          : "PRIMARY_ACCEPTED",
        timestamp: new Date().toLocaleString(),
      };

      setEvents((previous) => [newEvent, ...previous]);
      setLoading(false);
    }, 500);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">N</div>
          <div>
            <h2>NotifyFlow</h2>
            <p>Cloud Reliability</p>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active">▦ Dashboard</div>
        <div className="nav-item">↗ Delivery Events</div>
        <div className="nav-item">⚙ Settings</div>

        <div className="sidebar-bottom">
          <span className="online-dot" />
          Prototype mode
          <p>CF-PS-35 · Notification Fallback</p>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">CLOUD MONITORING / OVERVIEW</p>
            <h1>Notification Dashboard</h1>
            <p className="subtitle">
              Monitor delivery attempts and fallback events.
            </p>
          </div>

          <span className="demo-badge">SIMULATION MODE</span>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow light">CF-PS-35 PROJECT</p>
            <h2>Reliable notifications, even when delivery fails.</h2>
            <p>
              Test the primary channel and verify the fallback workflow.
              No real messages are sent in this prototype.
            </p>
          </div>
          <div className="welcome-icon">⇄</div>
        </section>

        <div className="section-heading">
          <h2>Delivery overview</h2>
          <span>Based on current demo events</span>
        </div>

        <section className="stats">
          <Stat title="Total Events" value={events.length} icon="▤" />
          <Stat title="Primary Success" value={primarySuccess} icon="✓" />
          <Stat title="Fallback Success" value={fallbackSuccess} icon="↗" />
          <Stat title="All Failed" value={failures} icon="!" />
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Test delivery workflow</h2>
              <p>Choose a scenario to run against the demo logic.</p>
            </div>
            <span className="demo-badge">MOCK DATA</span>
          </div>

          <div className="test-actions">
            <div className="test-card">
              <div className="test-icon green">✓</div>
              <h3>Primary succeeds</h3>
              <p>
                Simulate successful email acceptance.
                The fallback is skipped.
              </p>
              <button
                disabled={loading}
                onClick={() => runTest(false)}
              >
                {loading ? "Running..." : "Test primary success"}
              </button>
            </div>

            <div className="test-card">
              <div className="test-icon orange">↗</div>
              <h3>Primary fails</h3>
              <p>
                Simulate email failure, then record a test fallback attempt.
              </p>
              <button
                className="secondary-button"
                disabled={loading}
                onClick={() => runTest(true)}
              >
                {loading ? "Running..." : "Simulate failure"}
              </button>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Recent delivery events</h2>
              <p>Newest events appear first.</p>
            </div>

            <button
              className="clear-button"
              onClick={() => setEvents([])}
            >
              Clear history
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>EVENT ID</th>
                  <th>SCENARIO</th>
                  <th>PRIMARY</th>
                  <th>FALLBACK</th>
                  <th>FINAL STATUS</th>
                  <th>TIMESTAMP</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="event-id">{event.id}</td>
                    <td>{event.message}</td>
                    <td>{event.primary}</td>
                    <td>{event.fallback}</td>
                    <td>
                      <Status status={event.status} />
                    </td>
                    <td className="time-cell">{event.timestamp}</td>
                  </tr>
                ))}

                {events.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty">
                      No events yet. Run a test to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer>
          <span>CF-PS-35 · Notification Delivery Fallback</span>
          <span>React frontend · Not connected to AWS</span>
        </footer>
      </main>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <strong>{value}</strong>
      <p>Current demo records</p>
    </article>
  );
}

function Status({ status }) {
  const labels = {
    PRIMARY_ACCEPTED: "Primary accepted",
    FALLBACK_ACCEPTED: "Fallback accepted",
    ALL_CHANNELS_FAILED: "All failed",
  };

  return (
    <span className={`status ${status}`}>
      {labels[status] || status}
    </span>
  );
}

export default App;
