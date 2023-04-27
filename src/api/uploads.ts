import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import cors from 'cors';
import handleCors from '../lib/cors';
import fetch from 'node-fetch'; // <-- import fetch here

const corsOptions = {
  origin: 'http://localhost:3000'
}

const uploadHandler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> = async (req, res) => {
  const { content } = req.body;
  try {
    // Include API endpoint in fetch call
    const response = await fetch('https://644ad55ba8370fb32158e570.mockapi.io/sales/sales_info', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const apiHandler: NextApiHandler = async (req, res) => {
  await handleCors(req, res, corsOptions);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  } else if (req.method === 'POST') {
    await uploadHandler(req, res);
  } else {
    res.status(404).send('Not found');
  }
};

export default apiHandler;