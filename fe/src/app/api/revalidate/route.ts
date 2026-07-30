import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-Demand ISR Revalidation API
 * 
 * Called by Laravel CMS webhook when admin updates content.
 * Purges Next.js cache for specific tags/paths so users see fresh content immediately.
 * 
 * POST /api/revalidate
 * Body: { secret: string, tags?: string[], paths?: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, tags, paths } = body;

    // Validate secret token
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: 'Invalid revalidation secret' },
        { status: 401 }
      );
    }

    const revalidated: string[] = [];

    // Revalidate by cache tags
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag);
        revalidated.push(`tag:${tag}`);
      }
    }

    // Revalidate by path
    if (Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
        revalidated.push(`path:${path}`);
      }
    }

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Revalidation failed' },
      { status: 500 }
    );
  }
}
