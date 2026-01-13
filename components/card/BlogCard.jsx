import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { blogViewSlugs } from "@/data/dataLayer/blogViewSlugs";
import { sendGTMEvent } from "@next/third-parties/google";

const BlogCard = ({ post }) => {
  const handleCardClick = () => {
    if (blogViewSlugs.includes(post?.slug)) {
      sendGTMEvent({
        event: `${post?.slug}`,
        post: {
          title: post?.title,
        },
      });
    }
  };

  return (
    <Link
      href={`/blog/${post?.slug}`}
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden max-w-sm  hover:shadow-lg transition-shadow duration-300 block"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <Image
          src={post?.featuredImage?.node?.sourceUrl}
          alt={post?.title}
          width={400}
          height={250}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="
            w-full h-[240px] object-cover
            transition-transform duration-500 ease-out
            group-hover:scale-105
          "
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-center gap-2 mb-3">
          {post?.categories?.nodes?.[0] && (
            <div className="bg-[#E7F6E9] text-[#35B34B] px-3 py-1 rounded-full text-sm font-medium inline-block">
              {post?.categories?.nodes[0]?.name}
            </div>
          )}
          <div className="text-xs sm:text-sm text-gray-700 font-medium text-right">
            {moment(post?.date).format("MMM Do YYYY hh:mm A")}
          </div>
        </div>

        {/* Title */}
        <h3
          className="
            text-lg font-semibold text-[#525253] mb-4 line-clamp-2
            transition-colors duration-300
            group-hover:text-neutral-900
            group-hover:underline group-hover:decoration-2
          "
        >
          {post?.title}
        </h3>

        {/* Author Info */}
        <div className="flex items-center gap-2">
          {post?.author?.node?.avatar?.url && (
            <Image
              src={post?.author?.node?.avatar?.url}
              alt={post?.author?.node?.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <span className="text-neutral-900 text-sm font-medium">
            {post?.author?.node?.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
