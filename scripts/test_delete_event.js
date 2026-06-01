(async () => {
  try {
    const apiBase = 'http://localhost:5000/api';

    // login as seeded admin
    const loginRes = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'minj6998@gmail.com', password: 'adminccet12' }),
    });

    const loginJson = await loginRes.json();
    console.log('LOGIN status:', loginRes.status);

    if (!loginJson.token) {
      console.error('Login failed');
      process.exit(1);
    }

    const token = loginJson.token;

    // Get all events first to find one to delete
    const getRes = await fetch(`${apiBase}/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const events = await getRes.json();
    console.log('Found events:', events.length);

    if (events.length === 0) {
      console.log('No events to delete, creating one first...');
      const eventPayload = {
        title: 'Test Delete Event',
        description: 'For testing delete',
        club: 'Sports Club',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
        time: '16:00',
        venue: 'Test Venue',
        poster: '',
        registrationLink: ''
      };

      const createRes = await fetch(`${apiBase}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(eventPayload),
      });
      const createdEvent = await createRes.json();
      console.log('Created event:', createdEvent._id);

      // Now delete it
      const deleteRes = await fetch(`${apiBase}/events/${createdEvent._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const deleteJson = await deleteRes.json();
      console.log('DELETE status:', deleteRes.status);
      console.log('DELETE body:', JSON.stringify(deleteJson, null, 2));
    } else {
      // Delete the first event
      const eventId = events[0]._id;
      console.log('Deleting event:', eventId);

      const deleteRes = await fetch(`${apiBase}/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const deleteJson = await deleteRes.json();
      console.log('DELETE status:', deleteRes.status);
      console.log('DELETE body:', JSON.stringify(deleteJson, null, 2));
    }
  } catch (err) {
    console.error('Test script error:', err);
    process.exit(1);
  }
})();
