import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    console.log("API", req.body)

    const { firstName, lastName, dob, gender, password, age } = req.body;
    if (!firstName || !lastName || !dob || !gender || !password || !age) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const exists = await User.findOne({ firstName, lastName, dob });
    if (exists) return res.status(400).json({ error: 'User already exists' });
    const user = new User({ firstName, lastName, dob, gender, password, age });
    await user.save();
    return res.status(201).json(user);
  }
  if (req.method === 'GET') {
    const users = await User.find();
    return res.status(200).json(users);
  }
  res.status(405).end();
}
