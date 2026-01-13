import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { blogViewSlugs } from "@/data/dataLayer/blogViewSlugs";
import { sendGTMEvent } from "@next/third-parties/google";

const RecentBlogs = ({ posts }) => {
    const handleCardClick = (post) => {
        if (blogViewSlugs.includes(post?.slug)) {
            sendGTMEvent({
                event: `${post?.slug}`,
                post: {
                    title: post?.title,
                }
            });
        }
    };

    // Get featured post (first post) and recent posts (next 4)
    const featuredPost = posts?.[0];
    const recentPosts = posts?.slice(1, 5);

    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-10">
                    Recent <span className="text-[#22C55E]">Blogs</span>
                </h2>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Featured Blog Post - Left Side */}
                    {featuredPost && (
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <Link href={`/blog/${featuredPost?.slug}`} className="block group">
                                <div className="relative">
                                    <Image
                                        src={featuredPost?.featuredImage?.node?.sourceUrl}
                                        alt={featuredPost?.title}
                                        width={600}
                                        height={400}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="w-full h-[250px] object-cover"
                                    />
                                </div>
                            </Link>

                            <div className="p-6">
                                {/* Category Badge and Date */}
                                <div className="flex items-center gap-3 mb-4">
                                    {featuredPost?.categories?.nodes?.[0] && (
                                        <span className="bg-primary text-[#2D5F2E] px-3 py-1 rounded text-sm font-medium">
                                            {featuredPost?.categories?.nodes[0]?.name}
                                        </span>
                                    )}
                                    <span className="text-sm text-gray-600">
                                        {moment(featuredPost?.date).format('MMM Do YYYY hh:mm A')}
                                    </span>
                                </div>

                                {/* Title */}
                                <Link 
                                    href={`/blog/${featuredPost?.slug}`} 
                                    className="block group"
                                    onClick={() => handleCardClick(featuredPost)}
                                >
                                    <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-neutral-700 transition-colors">
                                        {featuredPost?.title}
                                    </h3>
                                </Link>

                                {/* Excerpt */}
                                <div 
                                    className="text-sm text-neutral-600 mb-4 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: featuredPost?.excerpt }}
                                />

                                {/* Read More Button */}
                                <Link 
                                    href={`/blog/${featuredPost?.slug}`}
                                    onClick={() => handleCardClick(featuredPost)}
                                >
                                    <button className="bg-[#FFEF46] hover:bg-[#FDE047] text-neutral-900 px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                                        Read More
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Recent Blog Posts Grid - Right Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {recentPosts?.map((post) => (
                            <Link
                                key={post?.id}
                                href={`/blog/${post?.slug}`}
                                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group border border-gray-100"
                                onClick={() => handleCardClick(post)}
                            >
                                {/* Date */}
                                <div className="text-sm text-gray-500 mb-3">
                                    {moment(post?.date).format('MMMM DD, YYYY')}
                                </div>

                                {/* Title */}
                                <h4 className="text-base font-semibold text-neutral-900 mb-4 line-clamp-2 group-hover:text-neutral-700 transition-colors">
                                    {post?.title}
                                </h4>

                                {/* Author Info */}
                                <div className="flex items-center gap-2 mt-auto">
                                    <Image
                                        src={post?.author?.node?.avatar?.url}
                                        alt={post?.author?.node?.name}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="text-neutral-900 text-sm font-medium">
                                        {post?.author?.node?.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecentBlogs;

