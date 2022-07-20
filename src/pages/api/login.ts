import type { NextApiRequest, NextApiResponse } from 'next';

export type UserData = {
  username: string;
  password: string;
};

const users: UserData[] = [
  {
    username: 'user',
    password: 'test1234'
  },
  {
    username: 'user2',
    password: 'pass1234'
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const { method, body } = req;
  if (method === 'POST') {
    const bodyParsed = JSON.parse(body);
    const user = users.find(val => val.username === bodyParsed.username);
    const wrongCredential = !user || user.password !== bodyParsed.password;

    if (wrongCredential) {
      return await res.status(400).json({
        message: 'wrong username or password'
      });
    };

    return await res.status(200).json({ mesagge: 'success' });
  }

}
