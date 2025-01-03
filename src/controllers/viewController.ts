import { NextFunction, raw, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import SubscriberProfile from "../models/subscriberProfile";
import WriterProfile from "../models/writerProfile";
import EditorProfile from "../models/editorProfile";
import { StatusCodes } from "http-status-codes";
import Article from "../models/article";
import moment from "moment";
import { fetchTopCategories } from "./categoryController";
import mongoose from "mongoose";
import Category from "../models/category";
import Tag from "../models/tag";
import ArticleTag from "../models/article_tag";
import Comment from "../models/comment";
import * as categoryController from "./categoryController";
import * as tagController from "./tagController";
import * as articleController from "./articleController";
import { sanitizeSummary, sanitizeContent } from "../utils/sanitizeHTML";
import User from "../models/user";
import formatDate from "../utils/formatDate";
import { sub } from "date-fns";
import expressEjsLayouts from "express-ejs-layouts";

export const getHomePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    const latestArticles = (await articleController.getLatestArticles()).data.articles;
    const topArticles = (await articleController.getTopArticles()).data.articles;

    const trendingArticles = (await Article.find({ status: "published" })).map((article) => ({
        ...article.toObject(),
        summary: article.summary?.replace(/<\/?[^>]+(>|$)/g, ""),
        publish_date: moment(article.publish_date).format("DD-MM-YYYY"),
        created_at: moment(article.created_at).format("DD-MM-YYYY"),
    }));

    // sort trending articles by view count and limit to 10
    trendingArticles.sort((a, b) => b.view_count - a.view_count);
    trendingArticles.splice(10);


    const featuredArticles = (await Article.getFeaturedArticles()).map((article) => ({
        ...article.toObject(),
        summary: article.summary?.replace(/<\/?[^>]+(>|$)/g, ""),
        publish_date: moment(article.publish_date).format("DD-MM-YYYY"),
    }));

    // sanitize summary of featured articles
    featuredArticles.forEach((article) => {
        article.summary = sanitizeSummary(article.summary);
    });

    const topCategories = (await fetchTopCategories()).map((category) => ({
        ...category,
        publishDate: moment(category.publishDate).format("DD-MM-YYYY"),
    }));

    let profile = null;
    if (user?.role === "subscriber") {
        profile = await SubscriberProfile.findOne({ user_id: user._id }).lean();
    } else if (user?.role === "writer") {
        profile = await WriterProfile.findOne({ user_id: user._id }).lean();
    } else if (user?.role === "editor") {
        profile = await EditorProfile.findOne({ user_id: user._id }).lean();
    }

    return res.status(StatusCodes.OK).render("pages/default/home", {
        layout: "layouts/default",
        scripts: `<script src="/js/pages/home.js"></script>`,
        title: "Trang chủ",
        user,
        profile,
        topArticles: topArticles,
        latestArticle: latestArticles,
        featuredArticles: featuredArticles,
        topCategories: topCategories,
        trendingArticles: trendingArticles,
    });
});

export const getLoginPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.OK).render("pages/auth/login", {
        layout: "layouts/auth",
        title: "Đăng nhập",
        scripts: `<script src="/js/pages/login.js"></script>`,
    });
};

export const getForgotPasswordPage = (req: Request, res: Response, next: NextFunction) => {
    const { enterCode, email } = req.query;
    res.status(StatusCodes.OK).render("pages/auth/forgot_password", {
        layout: "layouts/auth",
        title: "Quên mật khẩu",
        scripts: `<script src="/js/pages/forgot_password.js"></script>`,
        enterCode,
        email,
    });
};

export const getResetPasswordPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.OK).render("pages/auth/reset_password", {
        layout: "layouts/auth",
        title: "Đặt lại mật khẩu",
        scripts: `<script src="/js/pages/reset_password.js"></script>`,
    });
};

export const getSignupPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.OK).render("pages/auth/signup", {
        layout: "layouts/auth",
        title: "Đăng ký",
        scripts: `<script src="/js/pages/signup.js"></script>`,
    });
};

export const getCreateUserPage = (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.OK).render("create_user");
};

export const getUpdateUserProfilePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const user = req.body.user;

    let profileOwner: any;
    if (user?.role === "subscriber") {
        profileOwner = await SubscriberProfile.findOne({ user_id: userId });
    } else if (user?.role === "writer") {
        profileOwner = await WriterProfile.findOne({ user_id: userId });
    } else if (user?.role === "editor") {
        profileOwner = await EditorProfile.findOne({ user_id: userId });
    } else {
        return next(new AppError(StatusCodes.NOT_FOUND, "No profile found for this user!"));
    }

    res.status(StatusCodes.OK).render("pages/default/update_profile", { 
        layout: "layouts/default",
        title: "Cập nhật thông tin cá nhân",
        styles: `<link rel="stylesheet" href="/css/update_user_profile.css" />`,
        scripts: `<script src="js/update_profile.js"></script>`,
        user: user, profile: profileOwner });
});

export const getCreateArticlePage = (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    let profile = null;
    if (user?.role === "subscriber") {
        profile = SubscriberProfile.findOne({ user_id: user._id }).lean();
    } else if (user?.role === "writer") {
        profile = WriterProfile.findOne({ user_id: user._id }).lean();
    } else if (user?.role === "editor") {
        profile = EditorProfile.findOne({ user_id: user._id }).lean();
    }

    console.log(profile);

    res.status(StatusCodes.OK).render("pages/default/create_article", {
        layout: "layouts/default",
        title: "Tạo bài viết",
        user,
        profile,
        article: null,
    });
};

export const getArticlePage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.id;
    const user = req.body.user;

    // Kiểm tra id bài viết
    if (!articleId) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Article id cannot be empty!"));
    }

    // Kiểm tra ID bài viết có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        return next(new AppError(StatusCodes.BAD_REQUEST, "Invalid article ID!"));
    }

    const articleObjectId = new mongoose.Types.ObjectId(articleId);
    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Article not found!"));
    }

    if (article.is_premium && user === null) {
        const message = "Bài viết chỉ dành cho độc giả!";
        return res.status(StatusCodes.FORBIDDEN).render("pages/default/access_denied", {
            layout: "layouts/default",
            title: "Truy cập bị từ chối",
            message,
        });
    }

    if (article.is_premium && user?.role === "subscriber") {
        const subscriber = await SubscriberProfile.findOne({ user_id: req.body.user._id });
        if (subscriber && (subscriber.subscription_status === "expired" || subscriber.subscription_status === "normal")) {   
            let message = "Bài viết này chỉ dành cho người đăng ký thành viên Premium!";
            if (subscriber.subscription_status === "expired") {
                message = "Tài khoản của bạn đã hết hạn";
            }
            return res.status(StatusCodes.FORBIDDEN).render("pages/default/access_denied", {
                layout: "layouts/default",
                title: "Truy cập bị từ chối",
                message,
            });
        }
    }

    // Tăng số lượt xem của bài viết
    await Article.incrementViewCount(articleObjectId);

    // Lấy lại bài viết sau khi đã cập nhật
    const updatedArticle = await Article.findById(articleId);
    if (!updatedArticle) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Updated article not found!"));
    }

    // Định dạng ngày xuất bản
    const formattedPublishDate = moment(updatedArticle.publish_date).format("DD-MM-YYYY");

    // Lấy tên thể loại bài viết
    const category = await Category.findById(updatedArticle.category_id);
    const categoryName = category ? category.name : "Unknown";

    // Lấy tên tác giả bài viết
    const writer = await WriterProfile.findById(updatedArticle.writer_id);
    const writerName = writer && writer.pen_name;

    // Lấy các thẻ của bài viết
    const tagsListID = await ArticleTag.find({ article_id: articleObjectId }).select("tag_id");

    const tags = await Tag.find({ _id: { $in: tagsListID.map((tag) => tag.tag_id) } });

    const tagNames = tags.map((tag) => tag.name);

    // Lấy tất cả bình luận cho bài viết
    const comments = await Comment.find({ article_id: articleObjectId }).populate("user_id create_at content").exec();
    // Lấy tất cả người dùng từ User
    const users = await User.find().select("_id name");

    const userMap = new Map(users.map((user) => [user._id.toString(), user.name]));

    const formattedComments = comments.map((comment) => {
        return {
            content: comment.content,
            date: comment.create_at,
            userName:
                comment.user_id && userMap.has(comment.user_id._id.toString())
                    ? userMap.get(comment.user_id._id.toString()) // Lấy tên người dùng từ Map
                    : "Ẩn danh",
        };
    });


    // Lấy các bài viết liên quan
    const relatedArticles = await Article.find({
        category_id: updatedArticle.category_id,
        _id: { $ne: updatedArticle._id },
    })
        .limit(5)
        .sort({ created_at: -1 })
        .select("title publish_date thumbnail")
        .exec();

    const formattedArticles = relatedArticles.map((article) => ({
        ...article.toObject(),
        publish_date: moment(article.publish_date).format("DD-MM-YYYY"), // Định dạng ngày
    }));

    // Làm sạch tóm tắt
    const rawSummary = updatedArticle.summary ?? "";
    const sanitizedSummary = sanitizeSummary(String(rawSummary));

    // Làm sạch nội dung bài viết
    const rawContent = updatedArticle.content ?? "";
    const sanitizedContent = sanitizeContent(String(rawContent));


    const editorCategory = user?.role === "editor" ? await EditorProfile.findOne({ user_id: user._id }) : null;

    let profile = null;
    if (user?.role === "subscriber") {
        profile = await SubscriberProfile.findOne({ user_id: user?._id }).lean();
    } else if (user?.role === "writer") {
        profile = await WriterProfile.findOne({ user_id: user?._id }).lean();
    } else if (user?.role === "editor") {
        profile = await EditorProfile.findOne({ user_id: user?._id }).lean();
    }

    // Render trang bài viết
    res.status(StatusCodes.OK).render("pages/default/detail_article", {
        layout: "layouts/default",
        title: updatedArticle.title,
        scripts: `<script src="/js/pages/detail_article.js"></script>
                <script src="/js/handling/reject_article.js"></script>
                <script src="/js/handling/approve_article.js"></script>
                <script
                    src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
                    integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
                    crossorigin="anonymous"
                    referrerpolicy="no-referrer"
                ></script>`,
        styles: `<link rel="stylesheet" href="/css/detail_article.css" />`,
        user,
        profile,
        article: {
            ...updatedArticle.toObject(),
            summary: sanitizedSummary,
            content: sanitizedContent,
            categoryName,
            writerName,
            tagNames,
            comments: formattedComments,
            relatedArticles: formattedArticles,
            publish_date: formattedPublishDate,
        },
        categories: await Category.find(),
        isOwnCategory: editorCategory?.category_id?.toString() === category?._id?.toString(),
    });
});

export const getEditArticleForm = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.articleId;

    const user = req.body.user;

    const writer = await WriterProfile.findOne({ user_id: user?._id });
    if (!writer) {
        return next(new AppError(StatusCodes.NOT_FOUND, "No profile found for this user!", true));
    }

    // status draft or rejected
    const article = await Article.findOne({ _id: articleId, status: { $in: ["draft", "rejected"] } }).populate(
        "category_id"
    );
    if (!article) {
        return next(new AppError(StatusCodes.NOT_FOUND, "Article not found!"));
    }

    if (article.writer_id.toString() !== writer._id?.toString()) {
        return next(new AppError(StatusCodes.FORBIDDEN, "You are not authorized to edit this article!"));
    }

    res.status(StatusCodes.OK).render("pages/edit_article", { user: user, article: article });
});

export const getCategoryArticleList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {    
    const user = req.body.user;

    const category = await Category.findById(req.params.categoryId);

    if (!category) {
        throw next(new AppError(StatusCodes.BAD_REQUEST, "Please provide category name"));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const articles = (await Article.find({ category_id: category._id, status: "published" })
        .skip(skip)
        .limit(limit)).map(article => ({
        ...article.toObject(),
        summary: article.summary?.replace(/<\/?[^>]+(>|$)/g, ""),
        created_at: moment(article.created_at).format('DD-MM-YYYY'),
    }))
    .sort((a, b) => {
        const getStatusPriority = (article: any) => {
            if (article.status === "published") return 3;
            if (article.status === "rejected") return 2;
            if (article.status === "draft") return 1;
            return 0;
        };

        const statusPriorityA = getStatusPriority(a);
        const statusPriorityB = getStatusPriority(b);

        // First, compare based on status (published > rejected > draft)
        if (statusPriorityA !== statusPriorityB) {
            return statusPriorityB - statusPriorityA;
        }

        // If statuses are the same, compare based on premium
        if (a.is_premium !== b.is_premium) {
            return b.is_premium ? 1 : -1;  // Premium first (highest priority)
        }

        return 0; // If both status and premium are the same, maintain original order
    });

    const totalArticles = await Article.countDocuments({ category_id: category._id, status: "published" });
    
    let profile = null;
    if (user?.role === "subscriber") {
        profile = await SubscriberProfile.findOne({ user_id: user._id }).lean();
    } else if (user?.role === "writer") {
        profile = await WriterProfile.findOne({ user_id: user._id }).lean();
    } else if (user?.role === "editor") {
        profile = await EditorProfile.findOne({ user_id: user._id }).lean();
    }

    return res.status(StatusCodes.OK).render("pages/default/articles_by_category", {
        layout: "layouts/default",
        scripts: `<script src="/js/pages/articles_by_category.js"></script>`,
        title: category.name,
        user: user,
        profile,
        category,
        articles,
        page,
        totalPages: Math.ceil(totalArticles / limit)
    });
})

export const getTagArticleList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    const tag = await Tag.findById(req.params.tagId);

    if (!tag) {
        throw next(new AppError(StatusCodes.BAD_REQUEST, "Please provide tag name"));
    }

    const article_tag = await ArticleTag.find({ tag_id: tag._id })
    const article_ids = article_tag.map(tag => tag.article_id);

    const page = parseInt(req.query.page as string) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const articles = (await Article.find({ _id: { $in: article_ids }, status: "published" })
        .populate("category_id")
        .skip(skip)
        .limit(limit)).map(article => ({
        ...article.toObject(),
        summary: article.summary?.replace(/<\/?[^>]+(>|$)/g, ""),
        created_at: moment(article.created_at).format('DD-MM-YYYY'),
    }))
    .sort((a, b) => {
        const getStatusPriority = (article: any) => {
            if (article.status === "published") return 3;
            if (article.status === "rejected") return 2;
            if (article.status === "draft") return 1;
            return 0;
        };

        const statusPriorityA = getStatusPriority(a);
        const statusPriorityB = getStatusPriority(b);

        // First, compare based on status (published > rejected > draft)
        if (statusPriorityA !== statusPriorityB) {
            return statusPriorityB - statusPriorityA;
        }

        // If statuses are the same, compare based on premium
        if (a.is_premium !== b.is_premium) {
            return b.is_premium ? 1 : -1;  // Premium first (highest priority)
        }

        return 0; // If both status and premium are the same, maintain original order
    });

    const totalArticles = await Article.countDocuments({ _id: { $in: article_ids }, status: "published" });
    res.status(StatusCodes.OK).render("pages/tag_articles", {
        user: user,
        tag,
        articles,
        page,
        totalPages: Math.ceil(totalArticles / limit)
    })
});

export const getWriterArticleList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    const writer = await WriterProfile.findOne({ user_id: user._id });
    if (!writer) {
        return next(new AppError(StatusCodes.NOT_FOUND, "No profile found for this user!"));
    }

    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = 5; // Limit of articles per page
    const skip = (page - 1) * limit; // Skip calculation

    // Get filter criteria
    const statusFilter = req.query.status;

    const filterCriteria: any = { writer_id: writer._id };
    if (statusFilter) {
        filterCriteria.status = statusFilter;
    }

    // Get the total count of articles for pagination
    const totalArticles = await Article.countDocuments(filterCriteria);

    // Fetch articles with pagination
    const articles = (await Article.find(filterCriteria)
        .populate("category_id")
        .skip(skip)
        .limit(limit)).map(article => ({
        ...article.toObject(),
        summary: article.summary?.replace(/<\/?[^>]+(>|$)/g, ""),
        content: article.content?.replace(/<\/?[^>]+(>|$)/g, ""),
        created_at: moment(article.created_at).format('DD-MM-YYYY'),
    }))
    .sort((a, b) => {
        const getStatusPriority = (article: any) => {
            if (article.status === "published") return 3;
            if (article.status === "rejected") return 2;
            if (article.status === "draft") return 1;
            return 0;
        };

        const statusPriorityA = getStatusPriority(a);
        const statusPriorityB = getStatusPriority(b);

        if (statusPriorityA !== statusPriorityB) {
            return statusPriorityB - statusPriorityA;
        }

        if (a.is_premium !== b.is_premium) {
            return b.is_premium ? 1 : -1;
        }

        return 0;
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalArticles / limit);

    res.status(StatusCodes.OK).render("pages/default/writer_articles", {
        layout: "layouts/default",
        title: "Danh sách bài viết",
        user: user,
        articles: articles,
        page: page,
        totalPages: totalPages,
        currentStatus: statusFilter || "", // Pass the current filter to the view
    });
});



export const getSearchPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 8;
        const search = (req.query.q as string) || "";
        const sortField = (req.query.sort as string) || "view_count";
        const sortOrder = (req.query.order as string) || "desc";
        const user = req.body.user;

        // Search query for title, summary, and content
        const searchQuery = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { summary: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ],
            status: 'published',
        };

        // Pagination calculation: (page - 1) * limit
        const startIndex = (page - 1) * limit;

        // Sorting options
        const sortOptions: { [key: string]: 1 | -1 } = { [sortField]: sortOrder === "desc" ? -1 : 1 };

        // Fetching articles with pagination and sorting
        const articles = await Article.find(searchQuery).skip(startIndex).limit(limit).sort(sortOptions);

        const categories = await Category.find({ _id: { $in: articles.map((article) => article.category_id) } });
        const tags = await Tag.find({ _id: { $in: articles.map((article) => article._id) } });

        // format publish date
        const formattedArticles = articles.map((article) => ({
            ...article.toObject(),
            publish_date: moment(article.publish_date).format("DD-MM-YYYY"),
        }));

        // Mapping articles to display relevant data
        const results = formattedArticles.map((article) => ({
            _id: article._id,
            title: article.title,
            tags: tags.find((tag) => tag._id === article._id)?.name || [],
            thumbnail: article.thumbnail || null,
            summary: sanitizeSummary(article.summary || ""),
            publishDate: article.publish_date || "Gần đây",
            viewCount: article.view_count || 0,
            sortField: sortField,
            is_premium: article.is_premium,
        }));

        let profile = null;
        if (user?.role === "subscriber") {
            profile = await SubscriberProfile.findOne({ user_id: user._id }).lean();
        } else if (user?.role === "writer") {
            profile = await WriterProfile.findOne({ user_id: user._id }).lean();
        } else if (user?.role === "editor") {
            profile = await EditorProfile.findOne({ user_id: user._id }).lean();
        }
        

        // Return the results, or a message if no articles are found
        res.render("pages/default/search", {
            layout: "layouts/default",
            title: "Tìm kiếm",
            styles: `<link rel="stylesheet" href="/css/search.css" />`,
            scripts: `<script src="/js/pages/detail_article.js"></script>`,
            user,
            profile,
            articles: results,
            page,
            limit,
            search,
            sortField,
            sortOrder,
            message: results.length
                ? `Kết quả tìm kiếm cho: ${search}`
                : "Không có bài viết nào phù hợp với từ khóa tìm kiếm của bạn.",
            suggestion: results.length ? null : "Hãy thử lại với từ khóa khác!",
        });
    } catch (error) {
        next(error);
    }
};


export const getRegisterPremiumSubscriberPage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    
    if (!user || user.role !== "subscriber") {
        return next(new AppError(StatusCodes.NOT_FOUND, "You are not authorized to access this page!", true));
    }
    const subscriber = await SubscriberProfile.findOne({ user_id: user._id });

    let profile = null;
    if (user.role === "subscriber") {
        profile = await SubscriberProfile.findOne({ user_id: user._id }).lean();
    } else if (user.role === "writer") {
        profile = await WriterProfile.findOne({ user_id: user._id }).lean();
    } else if (user.role === "editor") {
        profile = await EditorProfile.findOne({ user_id: user._id }).lean();
    }
    
    return res.status(StatusCodes.OK).render("pages/default/register_premium_subscriber", {
        layout: "layouts/default",
        title: "Đăng ký thành viên Premium",
        user,
        profile,
    });
});