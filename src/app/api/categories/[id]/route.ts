import { UserJwtPayload, withAuthParams } from '@/lib/api-auth';
import { withCORS } from '@/lib/cors';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Delete a specific category
export const DELETE = withCORS(withAuthParams(async (
  request: NextRequest,
  user: UserJwtPayload,
  context: { params: { id: string } }
) => {
  try {
    const categoryId = context.params.id;

    // Optional: Check if any tasks are associated with this category
    // If so, you might want to prevent deletion or handle it (e.g., set tasks' categoryId to null)
    // For now, we'll proceed with direct deletion. Prisma will error if tasks are linked by default
    // unless onDelete: Cascade or SetNull is specified in the schema for the relation.
    // Assuming your schema might prevent this if tasks are linked. Let's check schema.
    // For now, we'll attempt deletion and let Prisma handle constraints.

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Note: If tasks are associated with this category, this delete will fail
    // due to foreign key constraints unless `onDelete` behavior is set in your Prisma schema.
    // For example, `onDelete: SetNull` on the Task's category relation.
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    if (error.code === 'P2003') { // Prisma foreign key constraint violation
        return NextResponse.json(
            { error: 'Cannot delete category. It is associated with existing tasks. Please reassign or delete those tasks first.' },
            { status: 409 } // Conflict
        );
    }
    return NextResponse.json(
      { error: 'Something went wrong while deleting the category' },
      { status: 500 }
    );
  }
}));

export function OPTIONS(request: NextRequest, context: { params: { id: string } }) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://taskapp.stanleyluong.com', // Replace with your frontend domain
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
} 