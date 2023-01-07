import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function getUserRoute(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // インプットデータの取得
    const data = req.body;

    // Userテーブルに登録
    await prisma.user.create({
        data: data
    })
    res.json({result: true});
}
