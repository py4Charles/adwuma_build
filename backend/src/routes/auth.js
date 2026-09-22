const { Router } = require('express');
const { adminClient } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.post('/signup', async (req, res) => {
  const { email, password, username, role } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const { data, error } = await adminClient.auth.signUp({
    email,
    password,
    options: { data: { username, role } },
  });

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const { data, error } = await adminClient.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: error.message });
  res.json(data);
});

router.post('/signout', requireAuth, async (req, res) => {
  await adminClient.auth.admin.signOut(req.token);
  res.status(204).end();
});

router.get('/me', requireAuth, async (req, res) => {
  const { data: profile, error } = await req.client
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: req.user, profile });
});

module.exports = router;