import { UserJwtPayload, withAuth } from '@/lib/api-auth';
import { withCORS } from '@/lib/cors';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Get all categories
export const GET = withCORS(withAuth(async (request: NextRequest, user: UserJwtPayload) => {
  try {
    console.log('Fetching categories for user:', user.id);
    
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}));

// Create a new category
export const POST = withCORS(withAuth(async (request: NextRequest, user: UserJwtPayload) => {
  try {
    const { name, id } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // If id is provided, update existing category
    if (id) {
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: { name },
      });
      return NextResponse.json(updatedCategory);
    }
    
    // Otherwise create new category
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating category:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}));