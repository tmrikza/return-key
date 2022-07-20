import type { NextApiRequest, NextApiResponse } from 'next';

const fruits: Array<string> = [
  'Pineapple',
  'Peach',
  'Apple',
  'Watermelon',
  'Melon',
  'Guava',
  'Banana',
  'Orange',
  'Grape',
  'Kiwi',
  'Blueberry',
  'Blackberry',
  'Pear',
  'Tangerine',
  'Plum',
  'Mango',
  'Date',
  'Cantaloupe',
  'Strawberry',
  'Coconut'
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const { method } = req;
  if (method === 'GET') {

    return await res.status(200).json({ data: fruits });
  }
}
