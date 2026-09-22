export async function saveData(sessionId, data) {
  const payload = { session_id: sessionId, ...data };

  try {
    const response = await fetch('http://localhost:3000/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to save data');
    return result;

  } catch {
    console.log("logs error");
  }
}

// Example: