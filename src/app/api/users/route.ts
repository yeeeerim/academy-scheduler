import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/util/database';
import bcrypt from 'bcrypt';

/**
 * GET /api/users
 * 사용자 목록 조회
 */
export async function GET() {
  try {
    if (!process.env.MONGO_DB) {
      throw new Error('MONGO_DB 환경변수가 설정되지 않았습니다.');
    }

    const client = await connectDB;
    const usersCollection = client.db(process.env.MONGO_DB).collection('users');
    const users = await usersCollection.find().toArray();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Database access error:', error);
    return NextResponse.json({ error: error });
  }
}

/**
 * POST /api/users
 * 사용자 등록
 */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.MONGO_DB) {
      throw new Error('MONGO_DB 환경변수가 설정되지 않았습니다.');
    }
    const { id, name, password, role = 'STUDENT' } = await req.json(); // 요청 본문을 JSON으로 파싱

    const client = await connectDB; // MongoDB 연결
    const usersCollection = client.db(process.env.MONGO_DB).collection('users');

    // 🔹 패스워드 암호화 (bcrypt 사용)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const response = await usersCollection.insertOne({
      id,
      name,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({
      status: 201,
      message: 'User successfully created',
      data: response.insertedId,
    });
  } catch (error: any) {
    console.error('Failed to create a new user:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create a new user',
      error: error,
    });
  }
}
