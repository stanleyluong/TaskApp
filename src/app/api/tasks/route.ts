import { UserJwtPayload, withAuth } from '@/lib/api-auth';
import { withCORS } from '@/lib/cors';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Get all tasks for the current user
export const GET = withCORS(withAuth(async (request: NextRequest, user: UserJwtPayload) => {
  try {
    console.log('Fetching tasks for user:', user.id);
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        ...(status ? { status: status as any } : {}),
        ...(priority ? { priority: priority as any } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}));

// Create a new task
export const POST = withCORS(withAuth(async (request: NextRequest, user: UserJwtPayload) => {
  try {
    const { title, description, status, priority, categoryId, dueDate } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        categoryId: categoryId === "" ? null : categoryId,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: user.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}));

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://taskapp.stanleyluong.com',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}