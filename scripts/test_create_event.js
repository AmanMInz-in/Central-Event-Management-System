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
    console.log('LOGIN body:', JSON.stringify(loginJson, null, 2));

    if (!loginJson.token) {
      console.error('Login failed, cannot proceed to create event');
      process.exit(1);
    }

    const token = loginJson.token;

    const eventPayload = {
      title: 'Automated Test Event',
      description: 'Created by automated integration test',
      club: 'Cultural Club',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0,10),
      time: '18:00',
      venue: 'Main Hall',
      poster: '',
      registrationLink: ''
    };

    const createRes = await fetch(`${apiBase}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(eventPayload),
    });

    const createJson = await createRes.json();
    console.log('CREATE status:', createRes.status);
    console.log('CREATE body:', JSON.stringify(createJson, null, 2));
  } catch (err) {
    console.error('Test script error:', err);
    process.exit(1);
  }
})();
