import { adminClient, clientForUser } from "../lib/supabase.js";

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const { data, error } = await adminClient.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: error?.message || 'Invalid access token' });
  }

  req.user = data.user;
  req.token = token;
  req.client = clientForUser(token);
  next();
}

export default requireAuth;