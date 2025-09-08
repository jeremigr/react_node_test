let logs = []; // { id, userId, userName, role, tokenName, ip, loginAt, logoutAt }

const newId = () => Math.random().toString(36).slice(2, 10);

function addLogin({ userId, userName, role, tokenName, ip }) {
  const entry = {
    id: newId(),
    userId,
    userName,
    role,
    tokenName,
    ip,
    loginAt: new Date().toISOString(),
    logoutAt: null,
  };
  logs.unshift(entry);
  return entry;
}

function addLogout({ userId }) {
  const entry = logs.find(l => l.userId === userId && !l.logoutAt);
  if (entry) entry.logoutAt = new Date().toISOString();
  return entry || null;
}

function listLogs() { return logs; }

function removeLog(id) {
  const before = logs.length;
  logs = logs.filter(l => l.id !== id);
  return logs.length < before;
}

function clearLogs() { logs = []; }

// --- SIMULATION DE LOGS AU DEMARRAGE ---
logs = [
  {
    id: newId(),
    userId: "u123",
    userName: "Alice Test",
    role: "user",
    tokenName: "jwt-alice",
    ip: "127.0.0.1",
    loginAt: new Date().toISOString(),
    logoutAt: null,
  },
  {
    id: newId(),
    userId: "u456",
    userName: "Bob Admin",
    role: "admin",
    tokenName: "jwt-bob",
    ip: "127.0.0.1",
    loginAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    logoutAt: new Date().toISOString(),
  }
];

module.exports = { addLogin, addLogout, listLogs, removeLog, clearLogs };
