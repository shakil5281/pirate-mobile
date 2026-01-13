'use client';

import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { initializeApollo } from "@/lib/apolloInstance";
import BlogCard from "../../card/BlogCard";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { blogViewSlugs } from "@/data/dataLayer/blogViewSlugs";
import { sendGTMEvent } from "@next/third-parties/google";


const POSTS_PER_PAGE = 6;

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

export default function BlogListSection({ initialPosts, initialPageInfo, categoryFilter, searchQuery }) {
    const client = initializeApollo();
    const [posts, setPosts] = useState(initialPosts);
    const [pageInfo, setPageInfo] = useState(initialPageInfo);
    const [loading, setLoading] = useState(false);

    // Reset posts when category or search filter changes
    useEffect(() => {
        setPosts(initialPosts);
        setPageInfo(initialPageInfo);
    }, [initialPosts, initialPageInfo]);

    const handleLoadMore = async () => {
        if (!pageInfo.hasNextPage) return;

        setLoading(true);
        const { data } = await client.query({
            query,
            variables: {
                first: POSTS_PER_PAGE,
                after: pageInfo.endCursor,
                categoryName: categoryFilter && categoryFilter !== "All Articles" ? categoryFilter : undefined,
                search: searchQuery || undefined,
            },
            fetchPolicy: 'no-cache',
        });

        setPosts(prev => [...prev, ...data.posts.nodes]);
        setPageInfo(data.posts.pageInfo);
        setLoading(false);
    };

    if (!posts.length)
        return (
            <div className="text-center py-20 text-neutral-400">No blog posts found.</div>
        );

    // Separate first post and remaining posts
    const firstPost = posts[0];
    const remainingPosts = posts.slice(1);

    const handleFirstPostClick = () => {
        if (firstPost && blogViewSlugs.includes(firstPost?.slug)) {
            sendGTMEvent({
                event: `${firstPost?.slug}`,
                post: {
                    title: firstPost?.title,
                }
            });
        }
    };

    return (
        <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-white">
            {/* Section Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 sm:mb-8 md:mb-10 max-w-7xl mx-auto">
                Latest <span className="text-[#22C55E]">News</span>
            </h2>

            <div className="max-w-7xl mx-auto">
                {/* Featured First Blog - Fully Responsive Design */}
                <div className="mb-8 sm:mb-12 md:mb-16">
                    <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="w-full md:w-2/5 lg:w-1/2 relative">
                            <Link href={`/blog/${firstPost.slug}`} onClick={handleFirstPostClick}>
                                <div className="relative w-full h-56 sm:h-64 md:h-full min-h-[280px] md:min-h-[400px]">
                                    <Image
                                        src={firstPost.featuredImage?.node?.sourceUrl}
                                        alt={firstPost.title}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 50vw"
                                        priority
                                    />
                                </div>
                            </Link>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-3/5 lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
                            {/* Category Badge and Date */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                {firstPost.categories?.nodes?.[0] && (
                                    <span className="bg-[#E7F6E9] text-[#35B34B] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                                        {firstPost.categories.nodes[0].name}
                                    </span>
                                )}
                                <span className="text-xs sm:text-sm text-gray-500">
                                    {moment(firstPost.date).format('MMM DD, YYYY')}
                                </span>
                            </div>

                            {/* Title */}
                            <Link href={`/blog/${firstPost.slug}`} onClick={handleFirstPostClick}>
                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 hover:text-[#22C55E] transition-colors line-clamp-2 md:line-clamp-3">
                                    {firstPost.title}
                                </h3>
                            </Link>

                            {/* Excerpt */}
                            {firstPost.excerpt && (
                                <div
                                    className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: firstPost.excerpt }}
                                />
                            )}

                            {/* Read More Button */}
                            <Link
                                href={`/blog/${firstPost.slug}`}
                                onClick={handleFirstPostClick}
                                className="inline-flex items-center justify-center bg-[#FFEF46] hover:bg-[#FFE500] text-black font-semibold px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-300 w-full sm:w-fit text-sm sm:text-base hover:shadow-md"
                            >
                                Read More
                                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Remaining Blogs - Responsive Grid */}
                {remainingPosts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                        {remainingPosts.map(post => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>

            {/* Load More Button */}
            {pageInfo?.hasNextPage && (
                <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 sm:px-8 md:px-10 cursor-pointer py-3 sm:py-3.5 bg-[#FFEF46] hover:bg-[#FFE500] active:bg-[#FFD700] text-black rounded-full text-sm sm:text-base font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-md max-w-xs mx-auto"
                    >
                        {loading && <Spinner className="size-4 sm:size-5" />}
                        {loading ? "Loading..." : "Load More Articles"}
                    </button>
                </div>
            )}
        </section>
    );
}
