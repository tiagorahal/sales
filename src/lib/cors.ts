import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'],
});
const handleCors = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(fn ? fn(req, res) : result);
    });
  });
};
export default handleCors;