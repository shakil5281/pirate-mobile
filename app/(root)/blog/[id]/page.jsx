import { gql } from "@apollo/client";
import Image from "next/image";
import { initializeApollo } from "@/lib/apolloInstance";
import moment from "moment";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Dot } from "lucide-react";

function stripHtmlTags(str = "") {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}

export async function generateStaticParams() {
  try {
    const client = initializeApollo();
    
    // Add timeout to prevent hanging during build
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('GraphQL query timeout')), 10000);
    });
    
    const queryPromise = client.query({ 
      query: queryForAllPosts,
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    });

    const { data } = await Promise.race([queryPromise, timeoutPromise]);

    const posts = data?.posts?.nodes?.filter(post => post?.slug) || [];
    
    console.log(`Successfully generated ${posts.length} blog post paths for static generation`);

    return posts.map((post) => ({
      id: post.slug,
    }));
  } catch (error) {
    console.warn("WordPress API unavailable during build, skipping blog post static generation:", error.message);
    // Return empty array to skip static generation of blog posts
    // Posts will be generated on-demand at runtime
    return [];
  }
}




export async function generateMetadata({ params }) {
  try {
    const client = initializeApollo();
    const resolvedParams = await params;
    
    // Add timeout for metadata generation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Metadata query timeout')), 5000);
    });
    
    const queryPromise = client.query({
      query: queryPostSeo,
      variables: { slug: resolvedParams?.id },
      fetchPolicy: 'network-only',
    });

    const { data } = await Promise.race([queryPromise, timeoutPromise]);

    const seo = data?.postBy?.seo;

    return {
      title: seo?.title || "Blog Post | Pirate Mobile",
      description: seo?.metaDesc || "Read our latest blog post",
      ...(seo?.fullHead && { other: { fullHead: seo?.fullHead } }),
    };
  } catch (error) {
    console.warn("Unable to fetch blog post metadata:", error.message);
    return {
      title: "Blog Post | Pirate Mobile",
      description: "Read our latest blog post from Pirate Mobile",
    };
  }
}

export default async function BlogDetailPage({ params }) {
  try {
    const client = initializeApollo();
    const resolvedParams = await params;

    // Add timeout for post fetching
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Post query timeout')), 15000);
    });
    
    const queryPromise = client.query({
      query: queryForSinglePost,
      variables: { slug: resolvedParams?.id },
      fetchPolicy: 'network-only',
    });

    const { data } = await Promise.race([queryPromise, timeoutPromise]);

    const post = data?.postBy;

    if (!post) {
      console.warn(`Blog post not found for slug: ${resolvedParams?.id}`);
      notFound();
    }

  // Fetch related posts only if there's a category
  let categoryPosts = [];
  if (post?.categories?.nodes?.[0]?.name) {
    try {
      // Add timeout for related posts
      const relatedTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Related posts query timeout')), 5000);
      });
      
      const relatedQueryPromise = client.query({
        query: postByCategoryQuery,
        variables: {
          categorySlugs: post.categories.nodes[0].name,
          first: 3,
        },
        fetchPolicy: 'network-only',
      });

      const { data: categoryData } = await Promise.race([relatedQueryPromise, relatedTimeoutPromise]);
      categoryPosts = categoryData?.posts?.nodes?.filter(p => p.slug !== post.slug) || [];
    } catch (error) {
      console.warn("Unable to fetch related posts:", error.message);
      categoryPosts = [];
    }
  }

  // const plainExcerpt = stripHtmlTags(post?.excerpt);

  // Calculate reading time (assuming average reading speed of 200 words per minute)
  const calculateReadingTime = (content) => {
    if (!content) return 0;
    const text = stripHtmlTags(content);
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return minutes;
  };

  const readingTime = calculateReadingTime(post?.content);

  return (
    <div className="bg-white w-full min-h-screen">
      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-t from-white to-[#FFFBDB] py-8 sm:py-12 md:pt-28 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Category Badge */}
          <div className="flex justify-center mb-4 sm:mb-6">
            {post?.categories?.nodes?.[0] && (
              <Link href={`/blog/category/${post.categories.nodes[0].slug}`}>
                <span className="bg-white rounded-xl sm:rounded-2xl text-[#2D5F2E] px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-secondary transition-colors shadow-sm">
                  {post.categories.nodes[0].name}
                </span>
              </Link>
            )}
          </div>

          {/* Title */}
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 sm:mb-8 leading-tight px-2">
            {post?.title}
          </h1>

          {/* Author Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image
                src={post?.author?.node?.avatar?.url}
                alt={post?.author?.node?.name}
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
              <span className="text-sm sm:text-base font-medium text-neutral-900">
                {post?.author?.node?.name}
              </span>
            </div>

            <div className="flex items-center gap-0 sm:gap-3 text-xs sm:text-sm text-neutral-600">
              <span className="hidden sm:inline text-neutral-300">
                <Dot size={35} className="text-[#454F51]"/>
              </span>
              <span className="whitespace-nowrap">{moment(post?.date).format("MMM Do, YYYY")}</span>
              <span className="text-neutral-300">
                <Dot size={35} className="text-[#454F51]"/>
              </span>
              <span className="whitespace-nowrap">{readingTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Featured Image */}
        {post?.featuredImage?.node?.sourceUrl && (
          <div className="mb-6 sm:mb-8 md:mb-10 -mx-4 sm:mx-0">
            <Image
              src={post?.featuredImage?.node?.sourceUrl}
              alt={post?.title}
              width={1175}
              height={768}
              sizes="100vw"
              srcSet={post?.featuredImage?.node?.srcSet}
              className="w-full h-auto sm:rounded-xl md:rounded-2xl object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <article
          className="prose max-w-none text-neutral-800 leading-relaxed gap-4 sm:gap-5 lg:gap-6
                     prose-headings:font-bold prose-headings:text-neutral-900
                     prose-p:text-neutral-700 prose-p:leading-relaxed
                     prose-a:text-blue-600 prose-a:underline
                     prose-strong:text-neutral-900 prose-strong:font-semibold
                     prose-ul:list-disc prose-ol:list-decimal
                     prose-li:text-neutral-700 prose-li:my-1
                     prose-img:rounded-lg prose-img:w-full prose-img:h-auto
                     prose-blockquote:border-l-4 prose-blockquote:border-neutral-300 prose-blockquote:pl-4 prose-blockquote:italic
                     prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />

        {/* All Categories */}
        {post?.categories?.nodes?.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-neutral-200">
            <span className="text-xs sm:text-sm font-semibold text-neutral-700 mr-1 sm:mr-2">Categories:</span>
            {post?.categories?.nodes?.map((cat) => (
              <Link href={`/blog/category/${cat?.slug}`} key={cat?.id}>
                <span className="bg-neutral-100 text-neutral-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-neutral-200 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Related Posts Section */}
      {categoryPosts?.length > 0 && (
        <div className="bg-neutral-50 py-10 sm:py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-6 sm:mb-8 md:mb-10">
              Read More <span className="text-secondary">News</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {categoryPosts?.map((item) => (
                <RelatedBlogCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  } catch (error) {
    console.warn("Unable to render blog post:", error.message);
    // Return 404 if post cannot be fetched
    notFound();
  }
}

function RelatedBlogCard({ post }) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
      <Link href={`/blog/${post?.slug}`} className="block group">
        <div className="relative overflow-hidden">
          <Image
            src={post?.featuredImage?.node?.sourceUrl}
            srcSet={post?.featuredImage?.node?.srcSet}
            alt={post?.title}
            width={400}
            height={250}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-[200px] sm:h-[220px] md:h-[240px] object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Category Badge and Date Overlay */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
            {post?.categories?.nodes?.[0] && (
              <div className="bg-primary text-[#2D5F2E] px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium inline-block mb-1.5 sm:mb-2 shadow-sm">
                {post?.categories?.nodes[0]?.name}
              </div>
            )}
            <div className="text-xs sm:text-sm text-gray-800 font-medium bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded inline-block">
              {moment(post?.date).format('MMM Do, YYYY')}
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <Link href={`/blog/${post?.slug}`} className="block group flex-grow">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4 line-clamp-2 group-hover:text-neutral-700 transition-colors leading-snug">
            {post?.title}
          </h3>
        </Link>

        {/* Author Info */}
        <div className="flex items-center gap-2 mt-auto">
          <Image
            src={post?.author?.node?.avatar?.url}
            alt={post?.author?.node?.name}
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
          />
          <span className="text-neutral-900 text-xs sm:text-sm font-medium line-clamp-1">
            {post?.author?.node?.name}
          </span>
        </div>
      </div>
    </div>
  );
}


const queryForAllPosts = gql`
  query NewQuery {
    posts {
      nodes {
        id
        slug
      }
    }
  }
`;

const queryForSinglePost = gql`
  query GetPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      id
      title
      slug
      content
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
  }
`;

const queryPostSeo = gql`
  query GetPostSeo($slug: String!) {
    postBy(slug: $slug) {
      seo {
        metaDesc
        title
        fullHead
      }
    }
  }
`;

const postByCategoryQuery = gql`
  query GetPostsByCategorySlugs($categorySlugs: String, $first: Int!, $after: String) {
    posts(where: { categoryName: $categorySlugs }, first: $first, after: $after) {
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
    }
  }
`;


