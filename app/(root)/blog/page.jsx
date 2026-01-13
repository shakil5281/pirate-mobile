import BlogHeader from "@/components/features/blog/BlogHeader";
import BlogListSection from "@/components/features/blog/BlogListSection";
import {initializeApollo} from "@/lib/apolloInstance";
import {gql} from "@apollo/client";

const POSTS_PER_PAGE = 10;

const query = gql`
  query NewQuery($first: Int, $after: String, $categoryName: String, $search: String) {
    posts(
      first: $first, 
      after: $after,
      where: { 
        categoryName: $categoryName,
        search: $search
      }
    ) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            srcSet
            sourceUrl
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
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

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

// Mark function async!
export default async function BlogPage({ searchParams }) {
  const apolloClient = initializeApollo();

  // Await searchParams!
  const params = await searchParams;

  const tag = params?.tag ?? "All Articles";
  const search = params?.search ?? "";

  // Fetch all categories for the filter buttons
  let filters = ["All Articles"];
  try {
    // Add timeout for categories fetch
    const categoriesTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Categories query timeout')), 5000);
    });
    
    const categoriesQueryPromise = apolloClient.query({
      query: ALL_CATEGORIES_QUERY,
      fetchPolicy: 'network-only',
    });

    const { data: categoriesData } = await Promise.race([categoriesQueryPromise, categoriesTimeoutPromise]);

    // Create filters array with "All Articles" first, then sorted categories
    if (categoriesData?.categories?.nodes) {
      const categoryNames = categoriesData.categories.nodes.map(cat => cat.name).sort();
      filters = ["All Articles", ...categoryNames];
    }
  } catch (error) {
    console.warn("Unable to fetch blog categories:", error.message);
    // filters will default to ["All Articles"]
  }

  // Fetch posts with category and search filters applied at GraphQL level
  let data = { posts: { nodes: [], pageInfo: null } };
  try {
    // Add timeout for posts fetch
    const postsTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Posts query timeout')), 10000);
    });
    
    const postsQueryPromise = apolloClient.query({
      query,
      variables: { 
        first: POSTS_PER_PAGE,
        categoryName: tag !== "All Articles" ? tag : undefined,
        search: search || undefined,
      },
      fetchPolicy: 'network-only',
    });

    const result = await Promise.race([postsQueryPromise, postsTimeoutPromise]);
    data = result.data || data;
  } catch (error) {
    console.warn("Unable to fetch blog posts:", error.message);
    // data will default to empty posts array
  }

  return (
    <main>
      <BlogHeader filters={filters} search={search} tag={tag} />
      <BlogListSection
          initialPosts={data?.posts?.nodes || []}
          initialPageInfo={data?.posts?.pageInfo}
          categoryFilter={tag}
          searchQuery={search}
      />
    </main>
  );
}



// Fetch metadata from API
async function getBlogMetadata() {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || "https://main.d12w1k0c6cdci3.amplifyapp.com";
  const apiUrl = `${base}/api/metadata/blog`;

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("Not found");
    return await res.json();
  } catch {
    return null;
  }
}

// Dynamic metadata for the blog page
export async function generateMetadata() {
  const data = await getBlogMetadata();
  if (!data) {
    return {
      title: "Blog | Pirate Mobile",
      description: "Latest news and updates from Pirate Mobile."
    };
  }

  return {
    title: data.seo_meta_title || data.title,
    description: data.meta_description,
    openGraph: data.openGraph || {},
    twitter: data.twitter || {},
    other: data.schema
      ? {
          "application/ld+json": JSON.stringify(data.schema)
        }
      : undefined
  };
}