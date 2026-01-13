"use client";

import { useState } from "react";
import {gql} from "@apollo/client";
import {initializeApollo} from "@/lib/apolloInstance";
import BlogCard from "@/components/card/BlogCard";
import { Spinner } from "@/components/ui/spinner";

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


export default function LoadMoreBlog({ initialPosts, initialPageInfo, categorySlug }) {
    const [posts, setPosts] = useState(initialPosts);
    const [cursor, setCursor] = useState(initialPageInfo.endCursor);
    const [hasNextPage, setHasNextPage] = useState(initialPageInfo.hasNextPage);
    const client = initializeApollo();

    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        setLoading(true);
        const { data } = await client.query({
            query: POSTS_BY_CATEGORY_QUERY,
            variables: {
                categorySlugs: categorySlug,
                first: 6,
                after: cursor,
            },
        });
        setLoading(false);

        setPosts((prev) => [...prev, ...data.posts.nodes]);
        setCursor(data.posts.pageInfo.endCursor);
        setHasNextPage(data.posts.pageInfo.hasNextPage);
    };

    function convertSlugToTitle(slug) {
        return slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }


    return (
        <section className="py-16 px-4 md:px-8 bg-white">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-10 text-center">
                <span className="text-[#FFA928]">{ convertSlugToTitle(categorySlug)}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {posts?.map((item) => (
                    <BlogCard key={item.id} post={item} />
                ))}
            </div>
            {hasNextPage && (
                <div className="flex justify-center mt-10">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-8 py-3 bg-[#FFEF46] cursor-pointer hover:bg-[#FFEF46]/80 text-black rounded-full text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && <Spinner className="size-5" />}
                        {loading ? "Loading..." : "Load More Articles"}
                    </button>
                </div>
            )}
        </section>
    );
}
