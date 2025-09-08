import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;
  if (req.method === 'GET') {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  }
  if (req.method === 'PUT') {
    const { firstName, lastName, dob, gender, password, age } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.firstName = firstName;
    user.lastName = lastName;
    user.dob = dob;
    user.gender = gender;
    user.age = age;
    if (password) user.password = password;
    await user.save();
    return res.status(200).json(user);
  }
  if (req.method === 'DELETE') {
    await User.findByIdAndDelete(id);
    return res.status(204).end();
  }
  res.status(405).end();
}
