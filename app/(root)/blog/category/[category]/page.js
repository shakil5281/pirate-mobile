import { initializeApollo } from "@/lib/apolloInstance";
import LoadMoreBlog from "@/app/(root)/blog/category/[category]/LoadMoreBlog";
import {gql} from "@apollo/client";
import BlogHeader from "@/components/features/blog/BlogHeader";

export const CATEGORY_SLUGS_QUERY = gql`
    query GetCategorySlugs {
        categories {
            nodes {
                slug
            }
        }
    }
`;

export const POSTS_BY_CATEGORY_QUERY = gql`
    query GetPostsByCategorySlugs($categorySlugs: String, $first: Int!, $after: String) {
        posts(where: { categoryName: $categorySlugs }, first: $first, after: $after) {
            pageInfo {
                hasNextPage
                endCursor
            }
            nodes {
                id
                title
                slug
                excerpt
                date
                featuredImage {
                    node {
                        sourceUrl
                        srcSet
                    }
                }
                categories {
                    nodes {
                        id
                        name
                        slug
                    }
                }
                author {
                    node {
                        name
                        avatar {
                            url
                        }
                    }
                }
            }
        }
    }
`;

export async function generateStaticParams() {
    try {
        const client = initializeApollo();
        
        // Add timeout to prevent hanging during build
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Category slugs query timeout')), 10000);
        });
        
        const queryPromise = client.query({ 
            query: CATEGORY_SLUGS_QUERY,
            fetchPolicy: 'network-only',
        });

        const { data } = await Promise.race([queryPromise, timeoutPromise]);

        if (!data?.categories?.nodes) {
            console.warn('No categories found for static params generation');
            return [];
        }

        const categories = data.categories.nodes.filter(cat => cat?.slug);
        console.log(`Successfully generated ${categories.length} blog category paths for static generation`);

        return categories.map((category) => ({
            category: category.slug,
        }));
    } catch (error) {
        console.warn('WordPress API unavailable during build, skipping blog category static generation:', error.message);
        // Return empty array to skip static generation
        // Categories will be generated on-demand at runtime
        return [];
    }
}

export async function generateMetadata({
                                           params,
                                       }) {

    const resolvedParams = await params;

    return {
        title: `${resolvedParams.category} News | Pirate Mobile`,
        description: `Explore the latest articles in the ${resolvedParams.category} category.`,
    };
}

// Query to get all categories for the filter
const ALL_CATEGORIES_QUERY = gql`
    query GetAllCategories {
        categories {
            nodes {
                name
                slug
            }
        }
    }
`;

export default async function CategoryPage({ params }) {
    try {
        const client = initializeApollo();
        const resolvedParams = await params;

        // Add timeout for posts fetch
        const postsTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Category posts query timeout')), 10000);
        });
        
        const postsQueryPromise = client.query({
            query: POSTS_BY_CATEGORY_QUERY,
            variables: { categorySlugs: resolvedParams.category, first: 9 },
            fetchPolicy: 'network-only',
        });

        // Fetch posts for this category
        const { data } = await Promise.race([postsQueryPromise, postsTimeoutPromise]);

        // Add timeout for categories fetch
        const categoriesTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Categories query timeout')), 5000);
        });
        
        const categoriesQueryPromise = client.query({
            query: ALL_CATEGORIES_QUERY,
            fetchPolicy: 'network-only',
        });

        // Fetch all categories for the filter
        const { data: categoriesData } = await Promise.race([categoriesQueryPromise, categoriesTimeoutPromise]);

        // Add null checks to prevent build errors
        const posts = data?.posts?.nodes || [];
        const pageInfo = data?.posts?.pageInfo || { hasNextPage: false, endCursor: null };

        // Create filters from all categories
        const categoryNames = categoriesData?.categories?.nodes?.map(cat => cat.name).sort() || [];
        const filters = ["All Articles", ...categoryNames];

        // Convert category slug to name for the current tag
        const currentCategory = categoriesData?.categories?.nodes?.find(
            cat => cat.slug === resolvedParams.category
        );
        const currentTag = currentCategory?.name || resolvedParams.category;

        return (
            <main>
                <BlogHeader filters={filters} search="" tag={currentTag} />
                <LoadMoreBlog
                    initialPosts={posts}
                    initialPageInfo={pageInfo}
                    categorySlug={resolvedParams.category}
                />
            </main>
        );
    } catch (error) {
        console.warn('Unable to load category page:', error.message);
        
        // Return a fallback UI when WordPress API is unavailable
        return (
            <main>
                <BlogHeader filters={["All Articles"]} search="" tag="All Articles" />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-2xl font-bold mb-4">Unable to Load Category</h2>
                    <p className="text-gray-600 mb-6">
                        We're having trouble connecting to our blog service. Please try again later.
                    </p>
                    <a 
                        href="/blog" 
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Back to All Posts
                    </a>
                </div>
            </main>
        );
    }
}
